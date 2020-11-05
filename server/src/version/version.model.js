'use strict'

const mongoose = require('mongoose')
const { Schema } = mongoose

/**
 * Create application schema
 */
const versionSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'Application',
    required: false
  },
  version: {
    type: String,
    required: true
  },
  servicesUrls: {
    type: Array,
    required: true
  },
  minVersion: {
    type: String,
    required: true
  },
  created_at: Date,
  updated_at: Date
})

/**
 * Create a model using application schema
 */
module.exports = mongoose.model('Version', versionSchema)
