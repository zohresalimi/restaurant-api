const jwt = require('jsonwebtoken');
const accessTokenSecret = 'sceatsRestaurantsapiv1';

const validId = (id,res) => {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({message: "please provide id in correct format" });
    }
}

// generate JWT token
function generateAccessToken(username){
    return jwt.sign(username,accessTokenSecret)
}

module.exports = { validId, generateAccessToken }