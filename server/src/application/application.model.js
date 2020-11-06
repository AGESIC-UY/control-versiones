'use strict'

const mongoose = require('mongoose')
const { Schema } = mongoose

/**
 * Create application schema
 */
const applicationSchema = new Schema({
  identifier: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100
  },
  description: {
    type: String,
    required: false,
    minlength: 5
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Type',
    required: false
  },
  version: {
    type: Schema.ObjectId,
    ref: 'Version',
    required: false
  },
  created_at: Date,
  updated_at: Date
})

/**
 * Create a model using application schema
 */
module.exports = mongoose.model('Application', applicationSchema)
