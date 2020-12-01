'use strict'

const config = require('./config')
const show = require('./logging')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

const store = new MongoDBStore({
  uri: config.mongoUrl,
  collection: 'sessions'
})

store.on('ready', () => {
  show.debug('Session connected')
})

store.on('error', function (err) {
  show.debug('Session error: ' + err)
})
/**
 * Initialize redis for session cache
 */
const init = (app) => {
  app.use(session({
    secret: config.redisSecret,
    cookie: {
      maxAge: new Date(Date.now() + 3600000)
    },
    store: store,
    resave: false,
    saveUninitialized: false
  }))
}

module.exports = {
  init
}
