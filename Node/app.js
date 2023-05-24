require('dotenv').config();
const http = require('http')
const express = require('express')
var cors = require('cors')
const connection = require('./connection')
const app = express()
const userRoute = require("./routes/user")
const port =process.env.PORT
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.get('/', function (req, res) {
    res.send('Hello World!'); 
  });
  
app.use('/user', userRoute)



// const server = http.createServer(app)
// server.listen(()=>{
app.listen(port,() => {
    console.log("App listening", port
    )
})