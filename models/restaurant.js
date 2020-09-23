const mongoose = require('mongoose');
Schema = mongoose.Schema

const RestaurantSchema = new mongoose.Schema({
    "_id": Schema.Types.ObjectId,
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