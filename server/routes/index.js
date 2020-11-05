'use strict'

const homeRoute = require('./home')
const authRoute = require('./auth')
const userRoute = require('./user')
const errorRoute = require('./error')
const applicationRoute = require('./application')
const typeRoute = require('./type')
const versionRoute = require('./version')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')

/**
 * Initializing routes
 */
const init = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  app.use('/api/auth', authRoute)
  app.use('/api/user', userRoute)
  app.use('/api/application', applicationRoute)
  app.use('/api/type', typeRoute)
  app.use('/api/version', versionRoute)
  app.use('*', homeRoute)
  app.use('*', errorRoute)
}

module.exports = {
  init
}
