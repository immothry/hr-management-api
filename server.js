const express = require("express"); 
const mongoose =require("mongoose")
const dotenv = require("dotenv")
dotenv.config();

const app = express();

app.get('/',(req,res) => {
  res.send("server is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server is running of http://localhost:${PORT}`);
})

