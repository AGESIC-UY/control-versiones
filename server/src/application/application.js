'use strict'

const {
  applicationCreate,
  applicationUpdate,
  applicationRemove,
  applicationGetOne,
  applicationGetAll
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
    if (!err && application) {
      show.debug('Application created!')
      return res.json({
        type: 'applicationCreated',
        success: true,
        application: application.id
      })
    } else {
      show.debug('Application create failed!')
      return res.json({
        type: 'applicationCreate',
        success: false
      })
    }
  })
}

/**
 * Application Update
 */
action.applicationUpdate = (req, res, next) => {
  const data = req.body
  show.debug('Changing profile...')
  applicationUpdate(data, (err, application) => {
    if (!err && application) {
      show.debug('Application change success!')
      const data = {
        name: application.name,
        type: application.type,
        description: application.description,
        version: application.version,
        identifier: application.identifier
      }
      return res.json({
        type: 'aplicationUpdate',
        success: true,
        application: data
      })
    } else {
      show.debug('Application change failed!')
      return res.json({
        type: 'aplicationUpdate',
        success: false
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
        type: 'applicationRemove',
        success: true
      })
    } else {
      show.debug('App remove failed!')
      return res.json({
        type: 'applicationRemove',
        success: false
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
    if (!err) {
      show.debug('App get success!')
      return res.json({
        type: 'application',
        success: true,
        application: application
      })
    } else {
      show.debug('App got failed!')
      return res.json({
        type: 'application',
        success: false
      })
    }
  })
}

/**
 * Application getAll
 */
action.applicationGetAll = (req, res, next) => {
  show.debug('Get all Application...')
  applicationGetAll((err, applications) => {
    if (!err) {
      show.debug('Apps got success!')
      return res.json({
        type: 'application',
        success: true,
        applications: applications
      })
    } else {
      show.debug('Apps got failed!')
      return res.json({
        type: 'application',
        success: false
      })
    }
  })
}

module.exports = action
