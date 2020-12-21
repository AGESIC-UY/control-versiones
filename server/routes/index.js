'use strict'

const homeRoute = require('./home')
const authRoute = require('./auth')
const userRoute = require('./user')
const errorRoute = require('./error')
const applicationRoute = require('./application')
const typeRoute = require('./type')
const versionRoute = require('./version')
const userApp = require('./userApp')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')
const protect = require('./protect')

/**
 * Initializing routes
 */
const init = (app) => {
  app.use('/api-docs', protect, swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  app.use('/api/auth', authRoute)
  app.use('/api/user', userRoute)
  app.use('/api/application', applicationRoute)
  app.use('/api/type', typeRoute)
  app.use('/api/version', versionRoute)
  app.use('/api/userApp', userApp)
  app.use('*', homeRoute)
  app.use('*', errorRoute)
}

module.exports = {
  init
}
