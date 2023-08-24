const jwt = require("jsonwebtoken");
require('dotenv').config()

const auth = (req,res,next)=>{
    const token = req.headers.authorization;

    if(!token){
        return res.status(404).json({"error":"Authorization Denied"})
    }
    try {
        const decoded = jwt.verify(token, process.env.JWTKEY)
        req.user = decoded
        next();
    } catch (error) {
        console.log(error.message)
        return res.status(501).json({"error":"Token is not valid"})
    }
}

module.exports = {auth};