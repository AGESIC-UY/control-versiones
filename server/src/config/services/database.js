'use strict'

const config = require('./config')
const show = require('./logging')
const mongoose = require('mongoose')

/**
 * Connecting to database
 */
const init = () => {
  show.debug('MongoDB url :' + config.mongoUrl)
  mongoose.connect(config.mongoUrl, {
    useNewUrlParser: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  const db = mongoose.connection
  error(db)
  open(db)
}

/**
 * Database error
 * @callback
 * @param {object} error
 */
const error = (db) => {
  db.on('error', (error) => {
    show.debug('Database connection error', error)
  })
}

/**
 * Database connected
 * @callback
 */
const open = (db) => {
  db.once('open', () => {
    show.debug('Database connected')
  })
}

module.exports = {
  init
}
