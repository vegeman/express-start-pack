import winston from 'winston'
import _ from 'lodash'
import moment from 'moment'

const logger = module.exports = winston.createLogger({
  level: process.env.NODE_ENV !== 'production' ? 'debug' : 'error',
  transports: [
    new winston.transports.Console(),
    new (winston.transports.File)({
      name: 'error-file',
      filename: 'error.log',
      level: 'error',
      maxsize: 1000000
    })
  ],
  format: winston.format.combine(
    winston.format.metadata(),
    winston.format.timestamp(),
    winston.format.printf(info => `[${info.level.toUpperCase()} ${moment().format('YYYY-MM-DD HH:mm:ss.SSS')}] ${info.message} ${info.meta && _.keys(info.meta).length ? `\n\t${JSON.stringify(info.meta)}` : ''}`),
    winston.format.colorize({ all: true })
  )
})
