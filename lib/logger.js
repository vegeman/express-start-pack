const winston = require('winston');
const moment = require('moment')

let formatter = (options) => {
	let { message, timestamp, level } = options
	let printout = `[${level.toUpperCase()} ${timestamp()}] ${message}`
	return winston.config.colorize(level, printout)
}

const logger = module.exports = new (winston.Logger)({
	level: process.env.NODE_ENV != 'production' ? 'debug' : 'error',
  	transports: [
	    new (winston.transports.Console)({
			timestamp() {
				return moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss.SSS')
			},
			formatter
	    })
  	]
});

logger.error('This is an message.');
logger.debug('This is an message.');
logger.warn('This is an message.');
logger.info('This is an message.');