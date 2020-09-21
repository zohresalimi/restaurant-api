const mongosse = require('mongosse');

const RestaurantSchema = new mongosse.schema({
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

module.exports = mongosse.model('Resturant', RestaurantSchema)