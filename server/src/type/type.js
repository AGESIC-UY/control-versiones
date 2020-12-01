'use strict'

const { typeCreate, typeUpdate, typeRemove, typeGetOne, typeGetAll } = require('./services/type')
const { show } = require('../config')
const action = {}

/**
 * Type Create
 */
action.typeCreate = (req, res, next) => {
  const data = req.body
  show.debug('Add type...')
  typeCreate(data, (err, type) => {
    if (!err && type) {
      show.debug('Type created!')
      return res.json({
        code: 200,
        message: 'Exito',
        description: 'Tipo creado correctamente',
        type: type.id,
        createdAt: type.createdAt
      })
    } else {
      show.debug('Type create failed!')
      return res.json({
        code: 422,
        message: 'Ocurrió un error',
        description: 'Nombre es requerido'
      })
    }
  })
}

/**
   * Type Update
   */
action.typeUpdate = (req, res, next) => {
  const data = req.body
  show.debug('Changing type...')
  typeUpdate(data, (err, type) => {
    if (!err && type) {
      show.debug('type change success!')
      const data = {
        // id: type.id,
        name: type.name
      }
      return res.json({
        code: 200,
        message: 'Exito',
        description: 'Tipo actualizado correctamente',
        tipo: data
      })
    } else {
      show.debug('Type change failed!')
      return res.json({
        code: 422,
        message: 'Ocurrió un error',
        description: 'Nombre es requerido o no se encontro tipo'
      })
    }
  })
}

/**
   * Type remove
   */
action.typeRemove = (req, res, next) => {
  const data = req.body
  show.debug('Removing type...')
  typeRemove(data, (err) => {
    if (!err) {
      show.debug('Type remove success!')
      return res.json({
        code: 200,
        message: 'Exito',
        description: 'Tipo removido con exito'
      })
    } else {
      show.debug('Type remove failed!')
      return res.json({
        code: 404,
        message: 'Ocurrió un error',
        description: 'Tipo no encontrado'
      })
    }
  })
}

/**
   * Type getOne
   */
action.typeGetOne = (req, res, next) => {
  const data = req.params.id
  show.debug('Getting Type...')
  typeGetOne(data, (err, type) => {
    if (!err && type) {
      show.debug('Type get success!', type)
      return res.json({
        code: 200,
        message: 'Exito',
        description: 'Tipo encontrado con exito',
        type: type
      })
    } else {
      show.debug('Type got failed!')
      return res.json({
        code: 404,
        message: 'Ocurrio un error',
        description: 'Tipo no encontrado'
      })
    }
  })
}

/**
   * Type getAll
   */
action.typeGetAll = (req, res, next) => {
  show.debug('Getting all Types...')
  typeGetAll((err, types) => {
    if (!err && types.length > 0) {
      show.debug('Got Types successfully!')
      return res.json({
        code: 200,
        message: 'Exito',
        description: 'Tipos encontrados con exito',
        types: types
      })
    } else {
      show.debug('Getting Types failed!')
      return res.json({
        code: 404,
        message: 'Ocurrio un error',
        description: 'No se encontraron tipos'
      })
    }
  })
}

module.exports = action
