require('dotenv').config()
const jwt = require('jsonwebtoken')


const checkRole = (req, res, next) => {
    console.log("process.env.USER).toString()",(process.env.USER_Name).toString())
    if (res.locals.role == (process.env.USER_Name))
        return res.sendStatus(401)
    else
        next()

}

module.exports = { checkRole: checkRole }