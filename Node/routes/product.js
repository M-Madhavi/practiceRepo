const express = require('express')
const router = express.Router();
const connection = require('../connection')
const auth = require('../services/authentication')
const checkrole = require('../services/checkRole')

router.post('/add', auth.authenticationToken, checkrole.checkRole, (req, res, next) => {
    let product = req.body;
    let query = "insert into product (name,categoryId,description,price,status) values(?,?,?,?,'true');"
    connection.query(query, [product.name, product.categoryId, product.description, product.price], (err, resp) => {
        if (!err) {
            return res.status(200).json({ message: "Product added successfully" })
        } else {
            return res.status(500).json(err)
        }
    })
});

router.get('/get', auth.authenticationToken, (req, res, next) => {
    let query = "select p.id,p.name,p.description,c.id as categoryId,c.name as categoryName from product p join category c on p.categoryId = c.id;"
    connection.query(query, (err, resp) => {
        if (!err) {
            if (resp.length <= 0) {
                return res.status(401).json({ message: "No products found" })
            }
            return res.status(200).json({ result: resp })
        } else {
            return res.status(500).json(err)

        }
    })
});

router.get('/categoryId/:id', auth.authenticationToken, (req, res, next) => {
    const id = req.params.id;
    let query = "select id,name from product where categoryId = ? and status ='true';"
    connection.query(query, [id], (err, resp) => {
        if (!err) {
            return res.status(200).json(resp)
        } else {
            return res.status(500).json(err)

        }
    })

})

router.put('/update', auth.authenticationToken, checkrole.checkRole, (req, res, next) => {
    const product = req.body;
    let query = "update product set name =?,categoryId=?,description=?,price=? where id=?"
    connection.query(query, [product.name, product.categoryId, product.description, product.price, product.id], (err, resp) => {
        if (!err) {
            if (resp.affectedRows == 0) {
                return res.status(404).json({ message: "Invalid id" })
            }
            return res.status(200).json({ message: "Product updated successfully" })
        } else {
            return res.status(500).json(err)
        }
    })
})

router.delete('/delete/:id', auth.authenticationToken, (req, res, next) => {
    const id = req.params.id;
    let query = "delete from product where id =?;"
    connection.query(query, [id], (err, resp) => {
        if (!err) {
            if (resp.affectedRows == 0) {
                return res.status(404).json({ message: "Invalid id" })
            }
            return res.status(200).json({ message: "Product deleted successfully" })
        } else {
            return res.status(500).json(err)

        }
    })

})

router.put('/updatestatus', auth.authenticationToken, checkrole.checkRole, (req, res, next) => {
    const user = req.body;
    let query = "update product set status = ? where id=?"
    connection.query(query, [user.status,user.id], (err, resp) => {
        if (!err) {
            if (resp.affectedRows == 0) {
                return res.status(404).json({ message: "Invalid product id" })
            }
            return res.status(200).json({ message: "Updated status successfully" })
        } else {
            return res.status(500).json(err)
        }
    })
})

module.exports = router
