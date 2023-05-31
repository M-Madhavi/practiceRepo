const express = require('express')
const connection = require('../connection')
const router = express.Router()
let ejs = require('ejs')
let pdf = require('html-pdf')
let path = require('path')
const fs = require('fs')
const uuid = require('uuid')
const auth = require('../services/authentication')


router.post('/generatereport', auth.authenticationToken, (req, res) => {
    const generateuuid = uuid.v1();
    const orderDetails = req.body;
    const productDetailsReport = JSON.parse(orderDetails.productDetails);
    console.log("productDetailsReport",productDetailsReport,generateuuid,orderDetails)
    let query = "insert into bill (name,uuid,email,contactNumber,paymentMethod,total,productDetails,createdBy) values(?,?,?,?,?,?,?,?)"
    connection.query(query, [orderDetails.name, generateuuid, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails, res.locals.email], (err, resp) => {
        if (!err) {
            ejs.renderFile(path.join(__dirname, '', "report.ejs"), { productDetails: productDetailsReport, name: orderDetails.name, email: orderDetails.email, contactNumber: orderDetails.contactNumber, paymentMethod: orderDetails.paymentMethod, totalAmount: orderDetails.totalAmount }, (err, results) => {
                if (err) {
                    return res.status(500).json(err)
                }
                else {
                    pdf.create(results).toFile('./generated_pdf/' + generateuuid + ".pdf", function (err, data) {
                        if (err) {
                            console.log("@@@@@@errr", err)
                            return res.status(500).json(err)
                        } else {
                            return res.status(200).json({ uuid: generateuuid })
                        }
                    })
                }
            })
        }
        else {
            return res.status(500).json(err)
        }
    })
})

module.exports = router