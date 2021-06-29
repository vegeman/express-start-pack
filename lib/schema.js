import mongoose from 'mongoose'

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const mongoSchema = {
  collections: new Schema({
    other_id: ObjectId,
    type: String
  })
}

module.exports = mongoSchema
