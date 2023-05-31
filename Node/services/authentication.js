require('dotenv').config()
const jwt = require('jsonwebtoken')


const authentication = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log("authHeader", authHeader, +"tokennnnn" + token)
    console.log("tokennnnn", token)

    if (token == null)
        return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, resp) => {
        if (err)
            return res.sendStatus(403)
        console.log("res.locals", res.locals, "res", resp)
        res.locals = resp
        next()
    })

}

module.exports = { authenticationToken: authentication }