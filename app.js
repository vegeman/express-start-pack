import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from './lib/logger.js'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import swaggerFile from './swagger-output.json'

import indexRouter from './routes/index'

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(helmet())
app.use(cors())
// app.use(logger('dev'));
app.use(express.json())
app.use(morgan('short', {
  skip: function(req, res) {
    return req.url === '/pingpong'
  }
}))
app.use(express.urlencoded({
  extended: false
}))
app.use(cookieParser('???????'))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

logger.error('This is a message.')
logger.debug('This is a message.')
logger.warn('This is a message.')
logger.info('This is a message.')

module.exports = app
