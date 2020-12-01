'use strict'

const mongoose = require('mongoose')
const { Schema } = mongoose

/**
 * Create type schema
 */
const typeSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'Application',
    required: false
  },
  name: {
    type: String,
    required: true,
    minlength: 5
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

/**
 * Create a model using type schema
 */
module.exports = mongoose.model('Type', typeSchema)
