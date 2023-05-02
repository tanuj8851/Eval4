const jwt = require("jsonwebtoken")
const redisClient = require("../helpers/redis")
require("dotenv").config()
const authenticator = async(req, res, next) => {

    try {


        const token = req.headers.authorization.split(" ")[1]

        if (!token) return res.status(401).send("Plese login again")

        const isTokenValid = await jwt.verify(token, process.env.token)

        if (!isTokenValid) return res.send("Authentication Failed, please login again")

        const isTokeBlacklisted = await redisClient.get(token)

        if (isTokeBlacklisted) return res.send("Unauthorized");

        req.body.userId = isTokenValid.userId;

        next()

    } catch (error) {
        res.send({ msg: error.message })



    }


    module.exports = { authenticator }


}