require('dotenv').config();
const http = require('http')
const express = require('express')
var cors = require('cors')
const connection = require('./connection')
const app = express()
const userRoute = require("./routes/user")
const categoryRoute = require('./routes/category')
const productRoute = require('./routes/product')
const billRoute = require('./routes/bill')
const dashboardRoute = require('./routes/dashboard')
const port = process.env.PORT
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.use('/user', userRoute)
app.use('/category',categoryRoute)
app.use('/product',productRoute)
app.use('/bill',billRoute)
app.use('/dashboard',dashboardRoute)



app.listen(port, () => {
  console.log("App listening", port
  )
})
