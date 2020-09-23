const express = require('express');
var router = express.Router()

// Models
const User = require('../models/user')

// utils
const { generateAccessToken} = require('../utils')

// get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        if(!users){
            return res.status(200).json({data: [], message:'no users'})
        }
        return res.status(200).json({users: users})
        
    } catch (err) {
        throw new Error(err);
    }
})

// signup method
router.post('/signup', async (req, res) => {
    const user = {
        username: req.body.username, 
        password: req.body.password
    }
    console.log(user)
    User.create(user, (err, user) => {
        console.log(user)
        if(err){
            throw new Error(err);  
        } 
        return res.status(201).json({user , message: 'user is created'});
    })
})

// login method
router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    console.log(username, password)
    try {
        const user = await User.findOne({username}).exec();
        console.log(user)
        /**
         * instead of sending separate error messages for
         * username and password we send a generic error for sequrity resons
         */
        if(!user  || user.password !== password){
            return res.status(400).json({message: "username or password is incorrect"});
        }
        const accessToken = generateAccessToken(username)
        return res.json({accessToken})
        
    } catch (err) {
        throw new Error(err); 
    }

})

module.exports = router