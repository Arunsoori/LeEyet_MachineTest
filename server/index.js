const express = require("express");
const app = express()
const cors =require("cors")
const mongoose =require("mongoose")
const cookieParser = require("cookie-parser")
const path = require('path');

const  authRoutes = require("./Routes/AuthRoutes")


app.listen(4000,()=>{
    console.log('server start on port 4000');
})
mongoose.connect("mongodb://127.0.0.1:27017/jwt",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>{
    console.log("DB Connection Successfull");
}).catch(err=>{
    console.log(err.message);
})
app.use(
    cors({
    origin:["http://localhost:3000"],
    method:["GET","POST"],
    credentials:true,
}))
app.use(cookieParser())

app.use(express.json())
app.use("/",authRoutes)

app.use(express.static(path.join(__dirname, 'public')));