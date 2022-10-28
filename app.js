import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import swaggerFile from './swagger-output.json'

import indexRouter from './routes/index'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(morgan('short', {
  skip: function(req, res) {
    return req.url === '/pingpong'
  },
}))
app.use(express.urlencoded({
  extended: false,
}))
app.use(cookieParser(''))
app.use(express.static(path.join(__dirname, 'public')))

if (process.env.NODE_ENV === 'development') {
  app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile, { swaggerOptions: { operationsSorter: 'method' }}))
}
app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // render the error page
  const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '')
    .split(',')[0]
    .trim()
  console.error(req.url, ip)
  if (err.status !== 404) console.log(err)
  if (err.status === 404) {
    return res.status(404).send('Not Found')
  }

  res.status(err.status || 500).send('Internal Server Error')
})

module.exports = app
