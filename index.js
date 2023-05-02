const express = require("express")
const app = express()
require("dotenv").config();
const { userRouter } = require("./routes/user.route")
const redisClient = require("./helpers/redis")

const { connection } = require("./config/db")
const port = process.env.PORT || 9999

app.use(express.json())

app.get("/", async(req, res) => {
    // res.send(await redisClient.get('name'))
    res.send("home")
})

app.use("/user", userRouter)




app.listen(port, async() => {
    try {

        await connection

        console.log("COnnected Successfully")


    } catch (error) {
        console.log({ msg: error.message })
    }
    console.log(`Server started at port ${port}`)
})