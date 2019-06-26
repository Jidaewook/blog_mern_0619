const express = require('express');
const router = express();

const mongoose = require('mongoose');
const userModel = require('../../models/user');
const profileModel = require('../../models/profile');

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

router.get('/', (req, res) => {
    const errors = {};

    profileModel
        .findOne({ user: req.body.id })
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors)
            }
            res.json(profile);
        })
        .catch(err => res.json(err))
});


//@router POST api/profile
//@desc  Profile route
//@access PUBLIC



module.exports = router;
