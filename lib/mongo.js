import mongoose from 'mongoose'
import _ from 'lodash'
import schema from './schema.js'
import logger from './logger.js'
const mongoHost = process.env.MONGO_HOST
const mongoPrimeHost = process.env.MONGO_PRIME_HOST
const mongoPort = process.env.MONGO_PORT
const mongoUser = process.env.MONGO_USER
const mongoPass = process.env.MONGO_PASS
const schemas = {}
let mongoUrl = ''
// mongoose.set('useCreateIndex', true)

const option = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: false,
  keepAlive: true,
  poolSize: 10,
  // serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  keepAliveInitialDelay: 30000
}

if (!mongoHost || !mongoPort) logger.error('Missing mongo host/port setting!!')

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'stage') {
  option.user = mongoUser
  option.pass = mongoPass
  if (mongoPrimeHost) {
    mongoUrl = `mongodb://${mongoPrimeHost}:${mongoPort},${mongoHost}:${mongoPort}/cloudBar?replicaSet=${process.env.APP_ENV === 'production' ? 'rs-prod-bws' : 'rs-bws'}&readPreference=secondary`
  } else {
    mongoUrl = `mongodb://${mongoHost}:${mongoPort}/cloudBar`
  }
} else {
  mongoUrl = `mongodb://${mongoHost}:${mongoPort}/cloudBar`
}

console.log(mongoUrl, option)
mongoose.connect(mongoUrl, option).catch(err => console.log(err))

Object.keys(schema).forEach((key) => {
  schemas[key] = mongoose.model(key, schema[key])
})

const mongo = {
  async get_collections(filter = {}) {
    return await schemas.collections
      .find(filter)
      .sort({ timestamp: -1 })
      .catch((err) => console.log(err))
  },
  async post_collections(data) {
    return await schemas.collections
      .updateOne({
        other_id: data.other_id
      }, {
        other_id: data.other_id,
        type: data.type
      }, {
        upsert: true
      })
      .catch((err) => err)
  }
}

module.exports = mongo