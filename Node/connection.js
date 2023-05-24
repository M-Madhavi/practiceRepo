require('dotenv')
const mysql = require('mysql')

var connection = mysql.createConnection({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})
connection.connect((err) => {
    if (!err) {
        console.log("Connected to DB")
    } else {
        console.log("Failed Connected to DB")
    }
})
module.exports = connection

