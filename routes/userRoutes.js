const express = require("express");
const UserRouter = express.Router();
const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

// Signup Route for use
UserRouter.post("/api/register", async(req,res)=>{
    try {
        const {username, email, avatar, password} = req.body

        const existingUser = await UserModel.findOne({email})
        if(existingUser){
            return res.status(200).json({"msg":"User Already registered"})
        }else{
            const hashedPwd = await bcrypt.hash(password, 10)
            const user = new UserModel({username,email,avatar,password:hashedPwd})
            await user.save()
            res.status(200).json({"msg":"User Registered Successfully"})
        }
    } catch (error) {
        console.log(error.message)
        res.status(501).json({"error":"Error in registering the user"})
    }
})


// SignIn Route for user
UserRouter.post("/api/login", async(req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(200).json({"msg":"Invalid Credentials"})
        }

        const isPwdMatch = await bcrypt.compare(password,user.password)
        if(!isPwdMatch){
            return res.status(200).json({"msg":"Password didn't match"})
        }

        const token = jwt.sign({userId:user._id}, process.env.JWTKEY);
        res.status(200).json({"msg":"Login successful", "token":token})
    } catch (error) {
        console.log(error.message)
        res.status(501).json({"error":"Error in logging in the user"})
    }
})


module.exports = {UserRouter}