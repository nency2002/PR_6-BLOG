const express = require('express');
const connect = require('./config/db');
const router = require('./routes/user.route');
const blog = require('./routes/blog');
const cookies=require("cookie-parser");

const app = express();
app.use(cookies())
app.use(express.json());
app.use(express.urlencoded({extended : true}));
// ejs mate ui ma print karva
app.set("view engine" ,"ejs");
app.set("views",__dirname+'/views');
app.use(express.static(__dirname+"/public"))
app.use("/user",router)
app.use("/blog",blog)


app.get("/",(req,res)=>{
    res.send("Welcome to the movie API")
  })
  
app.listen(8090 , ()=>{
    console.log("starting server");
    connect();
})