const express = require('express');
const router = express.Router();

const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

//Load User Model
const userModel = require('../../models/user');

//@router GET api/users/test
//@desc Tests users route
//@access Public
router.get('/test', (req, res) => res.json({msg: 'Users Works'}));


//@route POST api/users/register
//@desc Register user
//@access PUBLIC

router.post('/register', (req, res) => {
    userModel
        .findOne({email: req.body.email})
        .then(user => {
            if(user){
                return res.status(400).json({
                    emali: 'Email already exists'
                });
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', //Size
                    r: 'pg',  //Rating
                    d: 'mm'   //Default
                });
                const newUser = new userModel({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => res.json(err));
                    })
                })
            }

        })
        .catch(err => res.json(err));
});


//@route POST api/users/login
//@desc Login user / Returning JWT Token
//@access PUBLIC
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    //Find user by email
    userModel
        .findOne({email})
        .then(user => {
            if(!user){
                return res.status(404).json({
                    email: 'User not found'
                });
            }
            bcrypt
                .compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        res.json({msg: 'Success'});
                    } else{
                        return res.status(404).json({
                            password: 'Password incorrect'
                        });
                    }
                })
                .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
});




module.exports = router;