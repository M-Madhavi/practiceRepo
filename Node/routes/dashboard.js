const express = require('express');
const router = express.Router()
const connection = require('../connection')
const auth = require('../services/authentication')
const checkrole = require('../services/checkRole')

router.get('/details', auth.authenticationToken, (req, res) => {
    var categoryCount, productCount, billCount;
    let query = "select count(id) as categogyCount from category;"
    connection.query(query, (err, response) => {
        console.log("response", response)
        if (!err) {
            categoryCount = response[0].categogyCount
        } else {
            return res.status(500).json(err)
        }
    })
    let query1 = "select count(id) as productCount from product;"
    connection.query(query1, (err, response) => {
        console.log("response", response)
        if (!err) {
            productCount = response[0].productCount
        } else {
            return res.status(500).json(err)
        }
    })
    let query2 = "select count(id) as billCount from bill;"
    connection.query(query2, (err, response) => {
        console.log("response", response)
        if (!err) {
            billCount = response[0].billCount
            var data = {
                category: categoryCount,
                product: productCount,
                bill: billCount
            }
            return res.status(200).json(data)
        } else {
            return res.status(500).json(err)
        }
    })
})




module.exports = router