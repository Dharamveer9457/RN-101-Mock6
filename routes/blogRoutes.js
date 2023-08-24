const express = require("express");
const BlogRouter = express.Router();
const BlogModel = require("../models/blogModel");
const UserModel = require("../models/userModel");
const {auth} = require("../middleware/auth");
require('dotenv').config();

// Route to get all the blogs
BlogRouter.get("/api/blogs", auth, async(req,res)=>{
    try {
        const blogs = await BlogModel.find()
        res.status(200).json(blogs)
    } catch (error) {
        console.log(error.message)
        res.status(501).json({"error":"Error in getting the blogs"})
    }
})

// Search blog by using their title
BlogRouter.get("/api/blogs", auth, async(req,res)=>{
    try {
        const {title} = req.query;
        const blogs = await BlogModel.find({title})
        res.status(200).json({blogs})
    } catch (error) {
        console.log(error.message)
        res.status(501).json({"error":"Error in getting blogs by title"})
    }
})

// Search blog by using their category
BlogRouter.get("/api/blogs", auth, async(req,res)=>{
    try {
        const { category } = req.query;
        // console.log(category)
        let query = {};
        if (category) {
          query = { category: category };
        }
        const blogs = await BlogModel.find(query).populate('userId', 'username')
        res.status(200).json({blogs});
      } catch (error) {
        console.log(error.message)
        res.status(501).json({"error":"Error in getting data by category"})
      }
})

// Sort blogs by their date and order
BlogRouter.get("/api/blogs", auth, async(req,res)=>{
    try {
        const {sort,order} = req.query;
        const sortOrder = order==='asc'?1:-1;
        const blogs = await BlogModel.find().sort({date:sortOrder});
        res.status(200).json({blogs})
    } catch (error) {
        console.log(error.message)
        res.status(501).json({"error":"Error in sorting blogs by date"})
    }
})

// Create a new blog
BlogRouter.post("/api/blogs", auth, async(req,res)=>{
    try {
        const {title,content,category,date,likes,comments} = req.body;
        const userId = req.user.userId;
        // console.log(req.user)
        const user = await UserModel.findById(userId);
        // console.log(user)
        const username = user.username
        const blog = new BlogModel({userId,username,title,content,category,date,likes:0,comments:[]})
        await blog.save()
        res.status(200).json({"msg":"New Blog Created"})
    } catch (error) {
        console.log(error.message)
        res.status(501).json({"error":"Error in creating a blog"})
    }
})

// Route for edit and update the blog
BlogRouter.put("/api/blogs/:id", auth, async(req,res)=>{
    try {
        const blogId = req.params.id;
        const {content} = req.body;
        const blog = await BlogModel.findById(blogId)
        if(!blog){
            return res.status(404).json({"msg":"Blog not found"});
        }

        if(blog.userId.toString()!==req.user.userId){
            return res.status(404).json({"msg":"You are not the authorized person to update"});
        }

        blog.content = content
        await blog.save()
        res.status(200).json({"msg":"Blog Updated"})
    } catch (error) {
        console.log(error.message)
        res.status(501).json({"error":"Error in updating a blog"})
    }
})

// Route for deleting the blog
BlogRouter.delete("/api/blogs/:id", auth, async(req,res)=>{
    try {
        const blogId = req.params.id;
        const blog = await BlogModel.findById(blogId)
        if(!blog){
            return res.status(404).json({"msg":"Blog not found"});
        }

        if(blog.userId.toString()!==req.user.userId){
            return res.status(404).json({"msg":"You are not the authorized person to delete"});
        }

        await BlogModel.remove();
        res.status(200).json({"msg":"Blog Deleted"})
    } catch (error) {
        console.log(error.message)
        res.status(501).json({"error":"Error in deleting a blog"})
    }
})

// Route for update the likes on blog
BlogRouter.put("/api/blogs/:id/like", auth, async(req,res)=>{
    try {
        const blogId = req.params.id;
        const blog = await BlogModel.findById(blogId)
        if(!blog){
            return res.status(404).json({"msg":"Blog not found"});
        }

        // const liked = blog.likes.some(like=>like.userId.toString()===req.user.userId);
        // if(liked){
        //     return res.status(404).json({"msg":"You have already liked this blog"});
        // }
        blog.likes++;
        await blog.save()
        res.status(200).json({"msg":"Liked the blog"})
    } catch (error) {
        console.log(error.message)
        res.status(501).json({"error":"Error in liking a blog"})
    }
})

// Route for update the comments on blog
BlogRouter.put("/api/blogs/:id/comment", auth, async(req,res)=>{
    try {
        const blogId = req.params.id;
        const {content} = req.body;
        const blog = await BlogModel.findById(blogId)
        if(!blog){
            return res.status(404).json({"msg":"Blog not found"});
        }

        const userId = req.user.userId;
        const user = await UserModel.findById(userId);
        const username = user.username

        const newComment = {username:username,content}
        blog.comments.push(newComment)
        await blog.save()
        res.status(200).json({"msg":"Comment added to the blog"})
    } catch (error) {
        console.log(error.message)
        res.status(501).json({"error":"Error in commenting on a blog"})
    }
})



module.exports = {BlogRouter}
