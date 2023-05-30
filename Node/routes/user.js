const express = require('express')
const router = express.Router()
const connection = require('../connection')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const auth = require('../services/authentication')
const checkrole = require('../services/checkRole')




router.post('/signup', (req, res) => {
    let user = req.body;
    query = 'select email,password,role,status from user where email =?'
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                console.log("results", results)
                query = 'insert into user (name,contactNumber,email,password,status,role) values(?,?,?,?,"false","user");'
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "user registered successfully" })
                    } else {
                        return res.status(500).json(err)
                    }
                })
            } else {
                return res.status(400).json({
                    message: "Email already exists"
                })
            }
        } else {
            return res.status(500).json(err)
        }
    })
})

router.post('/login', (req, res) => {
    const user = req.body;
    let query = 'select email,password,role,status from user where email =?'
    connection.query(query, [user.email], (err, resp) => {
        if (!err) {
            console.log("RRRRRRRRRR", resp)
            if (resp.length <= 0 || resp[0].password != user.password) {
                return res.status(400).json({ message: "Incorrect username or password" })
            } else if (resp[0].status === 'false') {
                return res.status(400).json({ message: "Wait for admin approval" })

            } else if (resp[0].password === user.password) {
                const response = {
                    email: resp[0].email, role: resp[0].role
                }
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' })
                return res.status(200).json({ token: accessToken })

            } else {
                return res.status(400).json({ message: "something went wrong! please try after sometime" })
            }
        }
    })
})

var transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.EMAIL,
        password: process.env.PASSWORD
    },
    // secure: true, // Enable secure connection using STARTTLS
    // tls: {
    //   ciphers: 'SSLv3',
    //   rejectUnauthorized: false,
    //   secureProtocol: 'TLSv1_method',
    // },
})

router.post('/forgotpassword', (req, res) => {
    const user = req.body;
    let query = 'select email,password from user where email=?'
    connection.query(query, [user.email], (err, response) => {
        if (!err) {
            if (response.length <= 0) {
                return res.status(200).json({
                    message: 'Password sent to your mail successfully'
                })
            } else {
                console.log("RESPONSEEEEEEEEEE", response)
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: response[0].email,
                    subject: 'Password from cafe` management',
                    html: `<p><b>Your login Details for cafe management </b>
                    <br>
                    <b>Email:</b>`+ response[0].email + `
                    <br>
                    <b>Password:</b>`+ response[0].password + `
                    <br>
                    <a herf="http://localhost:4200/">Click here to login<a/>
                    </p>
                    `
                }
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log("Error while sending email", err)
                    }
                    console.log("Email Info", info)

                })
                return res.status(200).json({ message: "password sent successfully to your Email" })
            }
        } else {
            return res.status(500).json({ error: err })
        }
    })

})

router.get('/get', auth.authenticationToken, checkrole.checkRole, (req, res) => {
    let query = 'select id,name,email,contactNumber,status from user where role="user";'
    connection.query(query, (err, result) => {
        if (!err) {
            return res.status(200).json(result)
        } else {
            return res.status(500).json(err)
        }
    })
})

router.patch('/update', auth.authenticationToken, checkrole.checkRole, (req, res) => {
    let user = req.body;
    let query = 'update user set status =? where id=?;'
    connection.query(query, [user.status, user.id], (err, result) => {
        if (!err) {
            if (result.affectedRows == 0) {
                return res.status(404).json({ message: "user id does not exist" })
            }
            return res.status(200).json({ message: "user updated successfully" })
        } else {
            return res.status(500).json(err);
        }
    })
})

router.get('/checkToken', auth.authenticationToken, (req, res) => {
    return res.status(200).json({ message: "true" })
})

router.post('/changePassword', auth.authenticationToken, (req, res) => {
    const user = req.body;
    // console.log("@@@@@@",res,"#$$$$$$$$",res.locals)
    let email = res.locals.email
    console.log("email", email, user)
    let query = 'select * from user where email=? and password=?;'

    connection.query(query, [email, user.oldPassword], (err, resp) => {
        if (!err) {
            console.log("RRRRRRRR", resp)
            if (resp.length <= 0) {
                return res.status(400).json({ message: "Inncorrect oldPassword" })
            } else if (resp[0].password === user.oldPassword) {
                query = 'update user set password =? where email =?'
                connection.query(query, [user.newPassword, email], (err, results) => {
                    if (!err) {
                        return res.status(400).json({ message: "Password updated successfully" })
                    } else {
                        return res.status(500).json(err)
                    }
                })
            }
            else {
                return res.status(400).json({ message: "sometthing went wrong please again later or wrong old password" })

            }
        }
    })


})



module.exports = router