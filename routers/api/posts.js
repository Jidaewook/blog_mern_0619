const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const authCheck = passport.authenticate('jwt', {session: false});

const postModel = require('../../models/post');
const validatePostInput = require('../../validation/post');



//@router GET api/posts/tests
//@desc test Posts route
//@access PUBLIC

router.get('/tests', (req, res) => res.json({msg: 'posts Works'}));

//@router Post api/posts
//@desc Create post
//@access Private

router.post('/', authCheck, (req, res) => {
    const {errors, isValid} = validatePostInput(req.body);

    //Check Validation
    if(!isValid){
        //If any errors, send 400 with errors object
        return res.status(400).json(errors);
    }

    const newPost = new postModel({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save()
        .then(post => {
            res.json(post)
        })
        .catch(err => res.json(err));

});


module.exports = router;