const express = require('express');
const jwt = require('jsonwebtoken');
const { connect } = require('./config/detabase')

// Models
const Restaurant = require('./models/restaurant')

const app = express();
const port = 5001;
const accessTokenSecret = 'sceatsRestaurantsapiv1';

// authenticat a user
const userAuthenticate = (req, res, next) => {
    const publicRoutes = [
        '/login',
        '/signup'
    ]
    if(req.url === '/' || publicRoutes.some(route => req.url.includes(route))){
        next()
    }
    const authHeader = req.headers.authorization
    if(!authHeader){
        handleUnAuthorized(res)
        return
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, accessTokenSecret, (err, user) => {
        if(err){
            handleUnAuthorized(res)
            return
        }
        req.user = user;
        next()
    })
}

app.use(express.json())
app.use(userAuthenticate)

// define variables
// const data = {
//     restaurants: []
// }

const users = [
    {
        username: 'john',
        password: 'password123admin',
        role: 'admin'
    }, {
        username: 'anna',
        password: 'password123member',
        role: 'member'
    }
];

// handel unauthorized user 
const handleUnAuthorized = (res) =>{
    return res.status(401).json({ status : false, message: "token is expired"});
}


// get, delete, post, put
app.get('/', (req, res) => {
    res.json({messagev: "Hello"})
})

// get all restaurants
app.get('/api/v1/restaurants', async (req, res) =>{
    try{
        const restaurants = await Restaurant.find({})
        res.json({ status: 200, data: restaurants});
    } catch(err){
        throw new Error(err);
    }
})

// add a new restaurant
app.post('/api/v1/restaurants', (req, res) =>{
    const { body } = req;
    Restaurant.create(body, (err, data) => {
        if(err) {
            throw new Error(err);
        }
        res.json({ status: true, data: data })

    })
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


/* ___________ user authentication ___________ */

// generate JWT token
function generateAccessToken(username){
    return jwt.sign(username,accessTokenSecret)
}

// get all users
app.get('/users', (req, res) => res.json(users))

// signup method
app.post('/signup', (req, res) => {
    const {username, password} = req.body;
    users.push({username, password, role: 'user'});
    res.status(201).json({message: 'user is created'});
})

// login method
app.post('/login', (req, res) => {
    const {username, password} = req.body;
    const user = users.find( user => user.username === username && user.password === password);
    if(user){
        const accessToken = generateAccessToken(username)
        res.json({accessToken})
    }else{
        res.status(401).json({message: 'Invalid username or password'});
    }
})


connect();
app.listen(port, ()=> console.log('server is running .....'))