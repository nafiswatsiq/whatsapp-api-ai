import winston from 'winston';
import path from 'path';

const dateNow = new Date().toISOString().slice(0, 10)
const logDir = path.join(__dirname, `../../logs/debug-${dateNow}.log`)

const options: winston.LoggerOptions = {
    transports: [
        new winston.transports.Console({
            level: process.env.NODE_ENV === 'production' ? 'error' : 'debug'
        }),
        new winston.transports.File({ filename: logDir, level: 'debug' })
    ]
}

const logger = winston.createLogger(options)

if (process.env.NODE_ENV !== 'production') {
    logger.debug('Logging initialized at debug level')
}

export default logger