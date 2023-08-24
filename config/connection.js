const mongoose = require("mongoose");
require('dotenv').config()

const connection = mongoose.connect(process.env.mongoURL)
.then(()=>console.log("Connected to DB"))
.catch((error)=>console.log({"Error in connection to DB": error.message}))

module.exports = {connection}

