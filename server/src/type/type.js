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
        type: 'typeCreated',
        success: true,
        typeId: type.id
      })
    } else {
      show.debug('Type create failed!')
      return res.json({
        type: 'typeCreate',
        success: false
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
        type: 'typeUpdate',
        success: true,
        typeData: data
      })
    } else {
      show.debug('Type change failed!')
      return res.json({
        type: 'typeUpdate',
        success: false
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
        type: 'typeRemove',
        success: true
      })
    } else {
      show.debug('Type remove failed!')
      return res.json({
        type: 'typeRemove',
        success: false
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
    if (!err) {
      show.debug('Type get success!', type)
      return res.json({
        type: 'typeGetOne',
        success: true,
        typeData: type
      })
    } else {
      show.debug('Type got failed!')
      return res.json({
        type: 'typeGetOne',
        success: false
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
    if (!err) {
      show.debug('Got Types successfully!')
      return res.json({
        type: 'typeGetAll',
        success: true,
        TypeData: types
      })
    } else {
      show.debug('Getting Types failed!')
      return res.json({
        type: 'typeGetAll',
        success: false
      })
    }
  })
}

module.exports = action
