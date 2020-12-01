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
    required: true
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

/**
 * Create a model using application schema
 */
module.exports = mongoose.model('Version', versionSchema)
