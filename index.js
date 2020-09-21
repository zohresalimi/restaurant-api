const express = require('express');
const app = express();

const port = 5000;

app.use(express.json())

const data = {
    restaurants: []
}

// get, delete, post, put
app.get('/', (req, res) => {
    res.json({messagev: "Hello"})
})

app.get('/api/v1/restaurants', (req, res) => res.json(data))

// add a new restaurant
app.post('/api/v1/restaurants', (req, res) =>{
    const { body } = req;
    body.id = data.restaurants.length + 1;
    data.restaurants.push(body);
    res.json(data)
})

// retrieve a single restaurant
app.get('/api/v1/restaurants/:id', (req, res) => {
    const { id } = req.params;
    const restaurant = data.restaurants.find(aRestaurant => aRestaurant.id === +id)
    return res.json(restaurant)
})

// remove a restaurant from restaurants
app.delete('/api/v1/restaurants/:id', (req,res) => {
    const { id } = req.params;
    let deleted = false
    // 1- remove restaurant with filter method
    data.restaurants = data.restaurants.filter(aRestaurant => {
        if(aRestaurant.id === +id){
            deleted = true
            return false
        }
        return true
    });

    // 2- remove restaurant with splice method
    // const restaurantIndex = data.restaurants.findIndex(aRestaurant => aRestaurant.id === +id)
    // if(restaurantIndex != -1) {
    //     data.restaurants = data.restaurants.splice(restaurantIndex,1)
    //     deleted = true;
    // }
    return res.json({status: deleted, id})
})

// update a restaurant
app.put('/api/v1/restaurants/:id', (req, res) => {
    const { id } = req.params;
    const { body } = req;
    console.log(body)
    let updated = false;

    data.restaurants = data.restaurants.map(aRestaurant => {
        if(aRestaurant.id === +id){
            console.log(body)
            aRestaurant = {
                ...aRestaurant,
                ...body
            }
            updated = true;
        }
        console.log(aRestaurant)
        return aRestaurant
    })

    return res.json({status: updated, id})


})

app.listen(port, ()=> console.log('server is running .....'))