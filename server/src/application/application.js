'use strict'

const {
  applicationCreate,
  applicationUpdate,
  applicationRemove,
  applicationGetOne,
  applicationGetAll,
  applicationFromMobile,
  applicationCreateAll,
  applicationGetRelevant
} = require('./services/app')

const { show } = require('../config')
const action = {}

/**
 * Application Create
 */
action.applicationCreate = (req, res, next) => {

  const data = req.body
  show.debug('Add application...')
  applicationCreate(data, (err, application) => {
    const nameAlreadyTaken = 'Nombre ya ha sido registrado'
    if (!err && application) {
      show.debug('Application created!')
      return res.json({
        code: 200,
        message: 'Exito',
        description: 'Aplicacion creada correctamente',
        application: application.id,
        createdAt: application.createdAt
      })
    } else if (err === nameAlreadyTaken) {
      return res.json({
        code: 422,
        message: 'Ocurrió un error',
        description: 'El nombre ya ha sido registrado'
      })
    } else {
      show.debug('Application create failed!')
      return res.json({
        code: 422,
        message: 'Ocurrió un error',
        description: 'No se propociono el nombre el cual es requerido o este es mas corto que 5 caracteres o mayor a 100'
      })
    }
  })
}

/**
 *
 * Application create App, Version and type
 *
 */

action.applicationCreateAll = (req, res, next) => {
  const data = req.body
  show.debug('Add application...')
  applicationCreateAll(data, (err, application) => {
    console.debug('Errr ->>>', err)
    if (!err && application) {
      show.debug('Application created!')
      return res.json({
        code: 200,
        message: 'Exito',
        description: 'Aplicacion creada correctamente',
        application: application.id
      })
    } else {
      show.debug('Application create failed!')
      return res.json(err)
    }
  })
}

/**
 * Application Update
 */
action.applicationUpdate = (req, res, next) => {
  const data = req.body
  show.debug('Changing application...')
  applicationUpdate(data, (err, application) => {
    const nameAlreadyTaken = 'Nombre ya ha sido registrado'
    show.debug('Application change success!', application)
    if (!err && application) {
      show.debug('Application change success!', application)
      const data = {
        name: application.name,
        type: application.type,
        description: application.description,
        version: application.version,
        identifier: application.identifier
      }
      return res.json({
        code: 200,
        message: 'Exito',
        description: 'Aplicacion actualizada correctamente',
        application: data
      })
    } else if (err === nameAlreadyTaken) {
      return res.json({
        code: 422,
        message: 'Ocurrió un error',
        description: 'El nombre ya ha sido registrado'
      })
    } else {
      show.debug('Application change failed!')
      return res.json({
        code: 422,
        message: 'Ocurrió un error',
        description: 'Nombre es requerido'
      })
    }
  })
}

/**
 * Application remove
 */
action.applicationRemove = (req, res, next) => {
  const data = req.body
  show.debug('Removing Application...')
  applicationRemove(data, (err) => {
    if (!err) {
      show.debug('App remove success!')
      return res.json({
        code: 200,
        message: 'Exito',
        description: 'Aplicacion removida con exito'
      })
    } else {
      show.debug('App remove failed!')
      return res.json({
        code: 404,
        message: 'Ocurrió un error',
        description: 'Aplicacion no encontrada'
      })
    }
  })
}

/**
 * Application getOne
 */
action.applicationGetOne = (req, res, next) => {
  const { id } = req.params
  show.debug('Get an Application...')
  applicationGetOne(id, (err, application) => {
    // error handling
    if (!err && application !== null) {
      show.debug('App get success!')
      return res.json({
        code: 200,
        message: 'Exito',
        description: 'Aplicacion encontrada con exito',
        application: application
      })
    } else {
      show.debug('App got failed!')
      return res.json({
        code: 404,
        message: 'Ocurrio un error',
        description: 'Aplicacion no encontrada'
      })
    }
  })
}

/**
 *
 * Application from mobile
 */
action.applicationFromMobile = (req, res, next) => {
  show.debug('Get app from mobile...')
  const data = req.query
  applicationFromMobile(data, (err, app) => {
    if (!err && app !== null) {
      show.debug('Apps got success!')
      return res.json(app)
    } else {
      show.debug('Apps got failed!')
      return res.json(err)
    }
  })
}

/**
 * Application getAll
 */
action.applicationGetAll = (req, res, next) => {
  show.debug('Get all Application...')
  applicationGetAll((err, applications) => {
    if (!err && applications.length > 0) {
      show.debug('Apps got success!')
      return res.json({
        code: 200,
        message: 'Exito',
        description: 'Aplicaciones encontradas con exito',
        applications: applications
      })
    } else {
      show.debug('Apps got failed!')
      return res.json({
        code: 404,
        message: 'Ocurrio un error',
        description: 'No se encontraron aplicaciones'
      })
    }
  })
}

/**
 * Application get all relevant apps
 */
action.applicationGetRelevant = (req, res, next) => {
  const data = req.query
  show.debug('Get all relevant Application...')
  applicationGetRelevant(data, (err, applications) => {
    if (err == null && applications) {
      show.debug('Apps got success!', applications.apps)
      return res.json({
        code: 200,
        message: 'Exito',
        description: 'Aplicaciones encontradas con exito',
        applications: applications.apps
      })
    } else {
      show.debug('Apps got failed!')
      return res.json({
        code: 404,
        message: 'Ocurrio un error',
        description: 'No se encontraron aplicaciones'
      })
    }
  })
}
module.exports = action
