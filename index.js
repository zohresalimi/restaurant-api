const express = require('express');

const { connect } = require('./config/detabase')
const authRoute = require('./routes/authentication')
const v1Route = require('./routes/v1')

const app = express();
const port = 3000;

app.use(express.json())


// routes
app.use('/', authRoute)
app.use('/api/v1', v1Route)


// get, delete, post, put
app.get('/', (req, res) => {
    res.json({messagev: "Hello"})
})

connect();
app.listen(port, ()=> console.log('server is running .....'))