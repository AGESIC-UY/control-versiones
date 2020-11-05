'use strict'

const {
  config,
  express,
  session,
  passport,
  db,
  show,
  stats
  // socket
} = require('../config')
const routes = require('../../routes')
const mongoose = require('mongoose')
// const http = require('http')

/**
 * Start HTTP/2 server, database, socket.io connection
 * Load routes, services, check memory usage
 * @function
 */
const listen = () => {
  const app = express.init()
  session.init(app)
  passport.init(app)
  db.init()
  routes.init(app)
  // TODO revisar porque no queda publicado en el 3002 con createServer
  app.listen(config.port, function () {
    show.debug(`Listening at http://${config.host}:${config.port}`)
  })
  // const server = http.createServer(app).listen(config.port, config.host)
  // socket.listen(server)
  stats.memory()
}
/**
 * Close server, database connection
 * @function
 */
const close = () => {
  // server.close()
  mongoose.disconnect()
  show.debug('Server down')
}
module.exports = {
  listen,
  close
}
