const express = require('express');
const jwt = require('jsonwebtoken');
const { connect } = require('./config/detabase')

// Models
const Restaurant = require('./models/restaurant')
const User = require('./models/user')

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

// handel unauthorized user 
const handleUnAuthorized = (res) =>{
    return res.status(401).json({ status : false, message: "token is expired"});
}

const validId = (id,res) => {

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({message: "please provide id in correct format" });
    }
}

// get, delete, post, put
app.get('/', (req, res) => {
    res.json({messagev: "Hello"})
})

// get all restaurants
app.get('/api/v1/restaurants', async (req, res) =>{
    try{
        const restaurants = await Restaurant.find({})
        if(!restaurants){
            return res.status(404).json({message: 'No restaurants round'})
        }
        res.status(200).json({restaurants: restaurants});
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
        res.status(201).json({data: data});

    })
})

// retrieve a single restaurant
app.get('/api/v1/restaurants/:id', async(req, res) => {
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
app.delete('/api/v1/restaurants/:id', async(req,res) => {
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
app.put('/api/v1/restaurants/:id', async (req, res) => {
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


/* ___________ user authentication ___________ */

// generate JWT token
function generateAccessToken(username){
    return jwt.sign(username,accessTokenSecret)
}

// get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        if(!users){
            return res.status(404).json({message: 'No Users Found'})
        }
        return res.status(200).json({users: users})
        
    } catch (err) {
        throw new Error(err);
    }
})

// signup method
app.post('/signup', async (req, res) => {
    const {username, password, role="user"} = req.body;
    User.create({username, password, role}, (err, user) => {
        if(err) throw new Error(err);
        res.status(201).json({user , message: 'user is created'});
    })
})

// login method
app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    try {
        const user = await User.find({username, password}).exec();
        if(!user){
            return res.status(401).json({message: 'Invalid username or password'});
        }
        const accessToken = generateAccessToken(username)
        return res.json({accessToken})
        
    } catch (error) {
        
    }
    // const user = users.find( user => user.username === username && user.password === password);
    // if(user){
    // }else{
    //     res.status(401).json({message: 'Invalid username or password'});
    // }
})


connect();
app.listen(port, ()=> console.log('server is running .....'))