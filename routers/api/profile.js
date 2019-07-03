const express = require('express');
const router = express();

const mongoose = require('mongoose');
const userModel = require('../../models/user');
const profileModel = require('../../models/profile');
const validateProfileInput = require('../../validation/profile');
const validateEducationInput = require('../../validation/education');
const validateExperienceInput = require('../../validation/experience');


//private 접근을 할 때, accessToken을 넣기 위한 루트인즈
const passport = require('passport');

const authCheck = passport.authenticate('jwt', { session: false });


//@router GET api/profile/tests
//@desc tests Profile route
//@access PUBLIC

router.get('/test', (req, res) => res.json({ msg: 'Profile works' }));

//@router GET api/profile
//@desc get current user Profile route
//@access Private

router.get('/', authCheck, (req, res) => {
    const errors = {};

    profileModel
        .findOne({ user: req.user.id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors)
            }
            res.json(profile);
        })
        .catch(err => res.json(err))
});

//@router GET api/profile/all
//@desc get All user Profiles
//@access Public

router.get('/all', (req, res) => {
    const errors = {};

    profileModel.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if(!profiles){
                errors.noprofile = 'There is no profiles';
                return res.status(404).json(errors);

            }
            res.json(profiles);
        })

        .catch(err => res.json(err))

});

//@router GET api/profile/handle/:handle
//@desc get profile by handle
//@access Public

router.get('/handle/:handle', (req, res) => {
    const errors = {};

    profileModel
        .findOne({handle: req.params.handle})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                return res.status(400).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err))
})

//@router GET api/profile/user/:user_id
//@desc get profile by user
//@access Public

router.get('/user/:user_id', (req, res) => {
    const errors = {};

    profileModel
        .findOne({user: req.params.user_id})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                return res.status(400).json(errors);
            }
            res.status(200).json(profile);
        })
        .catch(err => res.json(err));
});



//@router POST api/profile/
//@desc  Create or edit user profile
//@access Private

router.post('/', authCheck, (req, res) => {
 
    const {errors, isValid} = validateProfileInput(req.body);    

    //check Validation
    if(!isValid){
        //Return any errors with 400status
        return res.status(400).json(errors);
    }



//GET Fileds 
    const profileFields = {};

    profileFields.user = req.user.id;
    
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

//Skills - Split into array
    if(typeof req.body.skills !== 'undefined'){
        profileFields.skills = req.body.skills.split(',');
    }

//Social
    profileFields.social = {};

    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

    profileModel
        .findOne({user: req.user.id})
        .then(profile => {
            if(profile){
                //update
                profileModel
                    .findOneAndUpdate(
                        {user: req.user.id},
                        {$set: profileFields},
                        {new: true}
                    )
                    .then(profile => res.json(profile))
                    .catch(err => req.json(err));
            } else {
                //check if handle exists
                profileModel
                    .findOne({handle: profileFields.handle})
                    .then(profile => {
                        if(profile){
                            errors.handle = 'That handle already exists';
                            res.status(400).json(errors);
                        }
                        new profileModel(profileFields)
                            .save()
                            .then(profile => res.json(profile))
                            .catch(err => req.json(err));
                    })
                    .catch(err => req.json(err));
            }
        })
        .catch(err => req.json(err));

});

//@router POST api/profile/education
//@desc  Add education to profile
//@access Private

router.post('/education', authCheck, (req, res) => {
   const {errors, isValid} = validateEducationInput(req.body); 

    //Check Validation
    if(!isValid){
        //Return any errors with 400 status
        return res.status(400).json(errors);
    }

    profileModel
        .findOne({user: req.user.id})
        .then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            };

            //Add to edu array
            profile.education.unshift(newEdu);

            profile.save()
                .then(profile => 
                    res.json(profile)
                )
                .catch(err => res.json(err));

        })
        .catch(err => res.json(err));

});


//@router DELETE api/profile/edu/:edu_id
//@desc  Delete education from profile
//@access Private

router.delete('/edu/:edu_id', authCheck, (req, res) => {
    profileModel
        .findOne({user: req.user.id})
        .then(profile => {
            const removeIndex = profile.education
                .map(item => item.id)
                .indexOf(req.params.edu_id);

                profile.education.splice(removeIndex, 1);

                profile.save()
                    .then(profile => 
                        res.json(profile)
                    )
                    .catch(err => res.json(err));
        })
        .catch(err=> res.json(err));
});


//@router POST api/profile/exp
//@desc  Add experience to profile
//@access Private

router.post('/exp', authCheck, (req, res) => {
    const {errors, isValid} = validateExperienceInput(req.body);

    //Check Validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    profileModel
        .findOne({user: req.user.id})
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                from: req.body.from,
                location: req.body.location,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            };

            //Add to exp array
            profile.experience.unshift(newExp);
            profile.save()
                .then(profile => 
                    res.json(profile)
                )
                .catch(err => res.json(err));

        })
        .catch(err => res.json(err));
});


//@router DELETE api/profile/exp/:epx_id
//@desc  Delete experience from profile
//@access Private

router.delete('/exp/:exp_id', authCheck, (req, res) => {
    profileModel
        .findOne({user: req.user.id})
        .then(profile => {
            //Get remove index
            const removeIndex = profile.experience
                .map(item => item.id)
                .indexOf(req.params.exp_id);

            //Splice out of array
            profile.experience.splice(removeIndex, 1);
            
            //save
            profile.save()
                .then(profile => 
                    res.status(200).json(profile)    
                )
                .catch(err=> res.json(err));
        })
        .catch(err => res.json(err));
});

//@route Delete api/profile
//@desc delete user and profile
//@access private

router.delete('/', authCheck, (req, res) => {
    profileModel.findOneAndDelete({user: req.user.id})
        .then(() => {
            userModel.findOneAndRemove({_id: req.user.id})
                .then(() => {
                    res.json({success: true});
                })
                .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
});


module.exports = router;
