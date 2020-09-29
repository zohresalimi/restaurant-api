const express = require('express');
var router = express.Router()

// Models
const User = require('../models/user')

// utils
const { generateAccessToken} = require('../utils')

// get all users
router.get('/users', (req, res) => {
    User.find({}, function(err, users) {
        if (err) {
            throw new Error(err);
        } else {
            if(!users.length){
                return res.status(200).json({data: [], message:'no users'})
            }
            return res.status(200).json({users: users})
        }
      });
})

// signup method
router.post('/signup', (req, res) => {
    const user = {
        username: req.body.username, 
        password: req.body.password
    }
    User.create(user, (err, user) => {
        if(err){
            throw new Error(err);  
        } 
        return res.status(201).json({user , message: 'user is created'});
    })
})

// login method
router.post('/login', (req, res) => {
    const {username, password} = req.body;
    console.log(username, password)
    User.findOne({username}, (err, user) => {
        if(err){
            throw new Error(err); 
        }
        /**
        * instead of sending separate error messages for
        * username and password we send a generic error for sequrity reason
        */
        if(!user  || user.password !== password){
            return res.status(400).json({message: "username or password is incorrect"});
        }
        const accessToken = generateAccessToken(username)
        return res.json({accessToken})
    })

})

module.exports = router