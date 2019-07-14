const express = require('express');
const router = express.Router();

const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//Load User Model
const userModel = require('../../models/user');

const authCheck = passport.authenticate('jwt', { session: false });
const userController = require('../../controllers/users');

//@router GET api/users/test
//@desc Tests users route
//@access Public
router.get('/test', (req, res) => res.json({msg: 'Users Works'}));


//@route POST api/users/register
//@desc Register user
//@access PUBLIC

router.post('/register', userController.user_signUp);


//@route POST api/users/login
//@desc Login user / Returning JWT Token
//@access PUBLIC
router.post('/login', userController.user_logIn);

//@route GET api/users/current
//@desc Return current user
//@access private

router.get('/current', authCheck, (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});

module.exports = router;