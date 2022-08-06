const winston = require('winston');

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: 'log/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'log/info.log', level: 'info' }),
        new (winston.transports.Console)({'timestamp':true}),
        //winston.format.printf(info => `${info.level}: ${info.label}: ${[info.timestamp]}: ${info.message}`),
    ],
    format: winston.format.combine(
        winston.format.timestamp({
           format: 'DD-MM-YYYY HH:mm:ss'
       }),
        winston.format.printf(info => `[${info.level}] ${[info.timestamp]} -> ${info.message}`),
    )
});
 
module.exports = logger;