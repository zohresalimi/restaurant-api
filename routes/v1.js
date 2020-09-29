const express = require('express');
var router = express.Router()

//middleware
const { userAuthenticate } = require('../middleware')

const Restaurant = require('../models/restaurant')

router.use(userAuthenticate)

// utils
const { validId } = require('../utils')

// get all restaurants
router.get('/restaurants', (req, res) =>{
    Restaurant.find({}, (err, restaurants) => {
        if(err){
            throw new Error(err);
        }
        if(!restaurants.length){
            return res.status(200).json({ message: 'No restaurants round'})
        }
        return res.status(200).json({restaurants});
    })

})

// add a new restaurant
router.post('/restaurants', (req, res) =>{
    const { body } = req;
    Restaurant.create(body, (err, data) => {
        if(err) {
            throw new Error(err);
        }
        res.status(201).json({data: data});

    })
})

// retrieve a single restaurant
router.get('/restaurants/:id', (req, res) => {
    const { id } = req.params;
    validId(id,res)
    Restaurant.findById(id, (err, resturant) => {
        if (err){
            throw new Error(err);
        }
        if(!resturant){
            return res.status(404).json({message: 'restaurant not found'});
        }
        return res.status(200).json({data: resturant});
    })
})

// remove a restaurant 
router.delete('/restaurants/:id', (req,res) => {
    const { id } = req.params;
    validId(id,res)
    let deleted = false
    Restaurant.findByIdAndRemove(id, (err, restaurant) => {
        if(err) {
            throw new Error(err);
        }
        if(!restaurant){
            return res.status(400).json({status: deleted, message: 'restaurant was not found!'});
        }
        deleted = true
        return res.status(200).json({status: deleted, id})
    })

})

// update a restaurant
router.put('/restaurants/:id', (req, res) => {
    const { id } = req.params;
    const { body } = req;
    validId(id,res)
    let updated = false;
    Restaurant.findByIdAndUpdate(id, body, (err, restaurant) => {
        if (err) {
            throw new Error(err);
        }
        if(!restaurant){
            return res.status(400).json({status: updated, message: 'Restaurant not found'})
        }
        updated = true
        return res.status(200).json({status: updated, id})
    })
})

module.exports = router