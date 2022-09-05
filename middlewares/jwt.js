require('dotenv').config()
const jwt = require('jsonwebtoken')
const {User} = require ('../models')
const {verifyToken} = require('../helpers/jwt')

function authenticationToken (req, res, next) {

    try{

    const authHeader = req.headers.access_token

    let decode = verifyToken(authHeader)
    console.log(decode,"INI DECODE")
    User.findOne({
        where:{email:decode.email}
    })
    .then(data=>{
        if(!data){
            res.status(401).json({message:"you need to register first"})
        }else{
            req.userId = data.id
            next()
        }
    })
    .catch(next)
    }catch(err){
        next(err)
    }
    // const authHeader = req.headers.authorization
    // const token = authHeader && authHeader.split('')[1]

    // if(token == null) return res.status(401)

    // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
    //     if(err) return res.status(403)
    //     req.user = user
    //     next()
    // })
}

module.exports = authenticationToken