const { Logger } = require("winston");
const redisClient = require("../helpers/redis")
const logger = require("../middlewares/logger")
const fetch = require("node-fetch")

const getIpinfo = async(req, res) => {
    const ip = req.params.ip;

    const cachedIPinfo = await redisClient.getAsync(ip);
    if (cachedIPinfo) {
        logger.info(`IP info for ${ip} retrieved from Redis cache.`)
        const { city } = JSON.parse(cachedIPinfo);
        res.json({ city });
    } else {
        const url = `https://ipapi.co/${ip}/json/`;

        try {
            const response = await fetch(url);
            const data = await response.json()
            const { city } = data;

            await redisClient.setAsync(ip, JSON.stringify(data), 'EX', 21600)
            Logger.info(`IP info for ${ip} retrieved from external Api`)
            res.json({ city })
        } catch (error) {
            logger.error('Error occured')
            res.status(500).json({ msg: "Error occured" })
        }
    }
}

module.exports = { getIpinfo }