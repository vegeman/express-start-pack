import mongo from '../lib/mongo'

const user = {
  async get(user_name) {
    // dummpy return
    return []

    // throw error
    // throw new Error('Error')

    // use database
    // return await mongo.getCollections({ user_name })
  }
}

module.exports = user
