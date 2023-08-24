const express = require("express")
const app = express();
const {connection} = require("./config/connection");
require('dotenv').config()
const cors = require("cors");
const {UserRouter} = require("./routes/userRoutes");
const {BlogRouter} = require("./routes/blogRoutes");

app.use(cors());
app.use(express.json());
app.use("/users",UserRouter);
app.use("/blogs", BlogRouter)


app.listen(process.env.PORT, async()=>{
    await connection
    .then(()=>console.log(`Server is running at ${process.env.PORT}`))
    .catch((error)=>console.log({"Error in server":error.message}))
})