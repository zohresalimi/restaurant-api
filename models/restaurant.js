const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    "id": Number,
    "img": String,
    "name": String,
    "description": String,
    "popularity": Number,
    "rating": Number,
    "maxDeliveryTime": Number,
    "menu": [
        {
            "category": String,
            "items": [
                {
                    "typeOfMeal": String,
                    "label": String,
                    "description": String,
                    "price": Number
                }
            ]
        }
    ]
})

module.exports = mongoose.model('Resturant', RestaurantSchema)