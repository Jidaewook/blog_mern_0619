const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const authCheck = passport.authenticate('jwt', {session: false});

const postModel = require('../../models/post');
const profileModel = require('../../models/profile');
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

//@route Get api/posts
//@desc Get posts
//@access Public

router.get('/', (req, res) => {
    postModel.find()
        .sort({date: -1})
        .then(posts => {
            res.json(posts);
        })
        .catch(err => res.json(err));
});

//@route Get api/posts/:id
//@desc Get post by id  게시물에 대한 아이디, 특정 게시물(상품)을 보러 들어가는 작업
//@access Public

router.get('/:id', (req, res) => {
    postModel.findById(req.params.id)
        .then(post => {
            res.json(post);
        })
        .catch(err => res.json(err));
});


//@route Delete api/posts/:id
//@desc Delete post
//@access private

router.delete('/:id', authCheck, (req, res) => {
    profileModel.findOne({user: req.user.id})
        .then(profile => {
            postModel.findById(req.params.id)
                .then(post => {
                    //Check for post owner
                    if(post.user.toString() !== req.user.id){
                        return res.status(401).json({msg: 'User not Authorized'});
                            
                    }

                    //Delete
                    post
                        .remove()
                        .then(() => res.json({msg: 'delete success'}))
                        .catch(err => res.json(err));
                })
                .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
});

//@route Post api/posts/like/:id
//@desc Like post
//@access Private

router.post('/like/:id', authCheck, (req, res) => {
    profileModel
        .findOne({user: req.user.id})
        .then(profile => {
            postModel   
                .findById(req.params.id)
                .then(post => {
                    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
                        return res.status(400).json({msg: 'User already liked this post'})
                    }
                    //Add user id to likes array
                    post.likes.unshift({user: req.user.id});

                    post.save()
                        .then(post => res.json(post));
                })
                .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
});

//@route Post api/posts/unlike/:id
//@desc UnLike post
//@access Private

router.post('/unlike/:id', authCheck, (req, res) => {
    profileModel
        .findOne({user:req.user.id})
        .then(profile => {
            postModel
                .findById(req.params.id)
                .then(post => {
                    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
                        return res.status(400).json({msg: 'You have not yet liked this post'})
                    }
                    //Get remove index
                    const removeIndex = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user.id);
                              
                    //Splice out of array
                    post.likes.splice(removeIndex, 1);

                    //Save
                    post.save()
                        .then(post => res.json(post));
                        
                })
                .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
});


module.exports = router;