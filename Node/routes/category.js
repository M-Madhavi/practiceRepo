const express = require('express')
const router = express.Router();
const connection = require('../connection')


router.get('/',(req,res) =>{
    return res.status(200).json({message:"In Categories"})
})


module.exports = router