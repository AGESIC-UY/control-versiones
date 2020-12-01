'use strict'

const {
  versionCreate,
  versionUpdate,
  versionRemove,
  versionGetOne,
  versionGetAll,
  getAllVersionsBasedOnRole
} = require('./services/version')
const { show } = require('../config')
const action = {}

/**
 * Version Create
 */
action.versionCreate = (req, res, next) => {
  const data = req.body
  show.debug('Add Version...')
  versionCreate(data, (err, version) => {
    if (!err && version) {
      show.debug('Version created!')
      return res.json({
        code: 200,
        message: 'Exito',
        description: 'Version creada correctamente',
        version: version.id,
        createdAt: version.createdAt
      })
    } else {
      show.debug('Version create failed!', err.errors)
      return res.json({
        code: 422,
        message: 'Ocurrió un error',
        description: 'Aplicacion, version, url de servicios y version minima son requeridos'
      })
    }
  })
}

/**
 * Version Update
 */
action.versionUpdate = (req, res, next) => {
  const data = req.body
  show.debug('Changing version...')
  versionUpdate(data, (err, version) => {
    console.debug(err)

    if (!err && version) {
      show.debug('Version change success!')
      const data = {
        urlsServices: version.urlsServices,
        minVersion: version.minVersion,
        version: version.version,
        id: version.id
      }
      return res.json({
        code: 200,
        message: 'Exito',
        description: 'Version actualizada correctamente',
        version: data
      })
    } else {
      show.debug('Version change failed!')
      return res.json({
        code: 422,
        message: 'Ocurrió un error',
        description: 'No se encontro Version o no se proporcionaron Aplicacion, version, url de servicios y version minima'
      })
    }
  })
}

/**
 * Version remove
 */
action.versionRemove = (req, res, next) => {
  const data = req.body
  show.debug('Removing Version...')
  versionRemove(data, (err) => {
    console.debug('removing', err)
    if (!err) {
      show.debug('Version remove success!')
      return res.json({
        code: 200,
        message: 'Exito',
        description: 'Version removida con exito'
      })
    } else {
      show.debug('Version remove failed!')
      return res.json({
        code: 404,
        message: 'Ocurrió un error',
        description: 'Version no encontrada'
      })
    }
  })
}

/**
 * Version getOne
 */
action.versionGetOne = (req, res, next) => {
  const { id } = req.params
  show.debug('Get an Application...')
  versionGetOne(id, (err, version) => {
    if (!err && version) {
      show.debug('Version get success!')
      return res.json({
        code: 200,
        message: 'Exito',
        description: 'Version encontrada con exito',
        version: version
      })
    } else {
      show.debug('Version got failed!')
      return res.json({
        code: 404,
        message: 'Ocurrio un error',
        description: 'Version no encontrada'
      })
    }
  })
}

/**
 * Version getAll
 */
action.versionGetAll = (req, res, next) => {
  show.debug('Get all Version...')
  versionGetAll((err, versions) => {
    if (!err && versions.length > 0) {
      show.debug('Version got success!')
      return res.json({
        code: 200,
        message: 'Exito',
        description: 'Versiones encontradas con exito',
        versions: versions
      })
    } else {
      show.debug('Version got failed!')
      return res.json({
        code: 404,
        message: 'Ocurrio un error',
        description: 'No se encontraron versiones'
      })
    }
  })
}

/**
 * Version getAllVersionsBasedOnRole
 */
action.getAllVersionsBasedOnRole = (req, res, next) => {
  show.debug('Get all Versions based on role...')
  const data = req.query
  console.debug('Query -->', data)
  getAllVersionsBasedOnRole(data, (err, versions) => {
    console.debug('debug', versions)
    if (!err && versions !== null) {
      show.debug('Version got success!')
      return res.json({
        code: 200,
        message: 'Exito',
        description: 'Versiones encontradas con exito',
        versions: versions
      })
    } else {
      show.debug('Version all by role got failed!')
      return res.json({
        code: 404,
        message: 'Ocurrio un error',
        description: 'No se encontraron versiones'
      })
    }
  })
}

module.exports = action
