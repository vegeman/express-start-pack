const winston = require('winston');
const _ = require('lodash')
const moment = require('moment')

let formatter = (options) => {
	let { meta, message, timestamp, level } = options
	let printout = `[${level.toUpperCase()} ${timestamp()}] ${message} ${meta && _.keys(meta).length ? '\n\t' + JSON.stringify(meta) : ''}`
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