const jwt = require('jsonwebtoken')
require('dotenv').config()

const KEY = `${process.env.ACCESS_TOKEN_SECRET}`
function generateToken(payload){
    console.log(KEY,"INI KEY")
    let token = jwt.sign(payload,KEY)
    return token
}

function verifyToken(token){
    return jwt.verify(token,KEY)
}

module.exports = {generateToken, verifyToken}