const winston = require("winston")
const { MongoDB } = require("winston-mongodb")


const logger = winston.createLogger({
    level: info,
    format: winston.format.json(),
    transports: [
        new MongoDB({
            db: process.env.dbLink,
            collection: "logs",
            options: true
        })
    ]
})

module.exports = { logger }