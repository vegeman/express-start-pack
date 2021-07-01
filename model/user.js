import mongo from '../lib/mongo'

const user = {
  async get(user_name) {
    return await mongo.getCollections({ user_name })
  }
}

module.exports = user
