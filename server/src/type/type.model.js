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
  created_at: Date,
  updated_at: Date
})

/**
 * Create a model using type schema
 */
module.exports = mongoose.model('Type', typeSchema)
