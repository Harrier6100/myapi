const log4js = require('log4js');
log4js.configure('./src/config/logger.json');
const logger = log4js.getLogger('error');

module.exports = (req, res, next) => {
    const ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
    const url = req.originalUrl;
    logger.info(`[${ip}]: ${url}`);
    next();
};