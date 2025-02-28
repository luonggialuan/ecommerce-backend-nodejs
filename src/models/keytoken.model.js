'use strict'

const { model, Schema } = require('mongoose') // Erase if already required
const shopModel = require('./shop.model')

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: shopModel.collection.name
    },
    privateKey: {
      type: String,
      required: true
    },
    publicKey: {
      type: String,
      required: true
    },
    refreshTokensUsed: {
      type: Array,
      default: []
    },
    refreshToken: {
      type: String,
      require: true
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema)
