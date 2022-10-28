import mongoose from 'mongoose'

const { Schema } = mongoose
const { ObjectId } = Schema.Types

/*
- every attribute must be defined with a type and (default value or required true)
- unique and default can not be used together
- subdocument must be wrapped in new Schema() again
*/

const mongoSchema = {
  collections: new Schema({
    other_id: ObjectId,
    type: { type: String, default: '' },
  }),
}

module.exports = mongoSchema
