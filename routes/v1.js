const express = require('express');
var router = express.Router()

//middleware
const { userAuthenticate } = require('../middleware')

const Restaurant = require('../models/restaurant')

router.use(userAuthenticate)

// utils
const { validId } = require('../utils')

// get all restaurants
router.get('/restaurants', async (req, res) =>{
    try{
        const restaurants = await Restaurant.find({})
        res.status(200).json({restaurants});
    } catch(err){
        res.status(200).json({ message: 'No restaurants round'})
        throw new Error(err);
    }
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
router.get('/restaurants/:id', async(req, res) => {
    const { id } = req.params;
    validId(id,res)
    try{
        const resturant = await Restaurant.findById(id).exec();
        if(!resturant){
            return res.status(404).json({message: 'restaurant not found'});
        }
        return res.status(200).json({data: resturant});
    } catch(err){
        throw new Error(err);
    }
})

// remove a restaurant 
router.delete('/restaurants/:id', async(req,res) => {
    const { id } = req.params;
    validId(id,res)
    let deleted = false
    try {
        const restaurant = await Restaurant.findByIdAndRemove(id)
        if(!restaurant){
            return res.status(400).json({status: deleted, message: 'restaurant was not found!'});
        }
        deleted = true
        return res.status(200).json({status: deleted, id})
        
    } catch (error) {
        throw new Error(err);
    }
})

// update a restaurant
router.put('/restaurants/:id', async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    validId(id,res)
    let updated = false;
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(id, body)
        if(!restaurant){
            return res.status(400).json({status: updated, message: 'Restaurant not found'})
        }
        updated = true
        return res.status(200).json({status: updated, id})
        
    } catch (error) {
        throw new Error(err);
    }
})

module.exports = router