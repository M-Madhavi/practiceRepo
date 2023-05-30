const express = require('express')
const router = express.Router();
const connection = require('../connection')
const auth = require('../services/authentication')
const checkrole = require('../services/checkRole')


router.get('/',(req,res) =>{
    return res.status(200).json({message:"In Categories"})
})

router.post('/add',auth.authenticationToken,checkrole.checkRole,(req,res,next) =>{
    let category = req.body;
    let query = 'insert into category (name) values(?);'
    connection.query(query,[category.name],(err,resp) =>{
        console.log("resp",resp)
        if(!err){
            return res.status(200).json({message:"Category added successfully"})
        }else{
            return res.status(500).json(err)
        }
    })
})

router.get('/get',(req,res) =>{//auth.authenticationToken,
    let query = 'select * from category order by name;'
    connection.query(query,(err,result) =>{
        if(!err){
            return res.status(200).json({result:result})
        }else{
            return res.status(500).json(err)
        }
    })
})

router.put('/update',auth.authenticationToken,checkrole.checkRole,(req,res,next) =>{
    let category = req.body;
    let query = 'update category set name=? where id=?;'
    connection.query(query,[category.name,category.id],(err,resp) =>{
        if(!err){
            if(resp.affectedRows == 0){
                return res.status(404).json({message:"Please provide valid id"})

            }
            return res.status(200).json({message:"Category updated successfully"})

        }else{
            return res.status(500).json(err)
        }
    })

})
module.exports = router