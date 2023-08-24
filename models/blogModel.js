const mongoose = require("mongoose");

const BlogSchema = mongoose.Schema({
    userId : {type:mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
    username : {type:String, required:true},
    title : {type:String, required:true},
    content : {type:String, required:true},
    category : {type: String, enum : ['Business', 'Tech', 'Lifestyle', 'Entertainment'], default: 'Tech', required:true},
    date : {type:Date, required:true},
    likes : {type:Number},
    comments : [{username:String, content:String}]
},{
    versionKey:false
})

const BlogModel = mongoose.model("Blogs", BlogSchema)

module.exports = BlogModel