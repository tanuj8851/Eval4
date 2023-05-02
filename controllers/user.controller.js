const user = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const redisClient = require("../helpers/redis")

const signup = async(req, res) => {
    try {

        const { name, email, password } = req.body;
        const isUserPresent = await user.findOne({ email })
        if (isUserPresent) return res.send("ALready Present Please login !")

        const hash = await bcrypt.hashSync(password, 8)

        const newUser = new user({ name, email, password: hash })

        await newUser.save()

        res.send("Sign Up Succcessful")

    } catch (error) {
        res.send(err.message)
    }
}

const login = async(req, res) => {
    try {

        const { email, password } = req.body;
        const isUserPresent = await user.findOne({ email })
        if (!isUserPresent) return res.send(" Please register first !");

        const isPasswordCorrect = await bcrypt.compareSync(password, isUserPresent.password)
        if (!isPasswordCorrect) return res.send("Password Incorrect")

        const token = await jwt.sign({ userId: isUserPresent._id }, process.env.token, { expiresIn: "1hr" })
        res.send({ msg: "Login Success", token })



    } catch (error) {
        res.send(err.message)
    }
}

const logout = async(req, res) => {
    try {

        const token = req.headers.authorization.split(" ")[1];

        if (!token) return res.status(403);

        await redisClient.set(token, token);
        res.send("logout successful")


    } catch (error) {
        res.send(err.message)
    }
}

module.exports = { signup, login, logout }