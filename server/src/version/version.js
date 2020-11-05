'use strict'

const {
  versionCreate,
  versionUpdate,
  versionRemove,
  versionGetOne,
  versionGetAll
} = require('./services/version')
const { show } = require('../config')
const action = {}

/**
 * Application Create
 */
action.versionCreate = (req, res, next) => {
  const data = req.body
  show.debug('Add Version...')
  versionCreate(data, (err, version) => {
    if (!err && version) {
      show.debug('Version created!')
      return res.json({
        type: 'versionCreated',
        success: true,
        version: version.id
      })
    } else {
      show.debug('Version create failed!', err)
      return res.json({
        type: 'versionCreate',
        success: false
      })
    }
  })
}

/**
 * Application Update
 */
action.versionUpdate = (req, res, next) => {
  const data = req.body
  show.debug('Changing version...')
  versionUpdate(data, (err, version) => {
    if (!err && version) {
      show.debug('Version change success!')
      const data = {
        urlsServices: version.urlsServices,
        minVersion: version.minVersion,
        version: version.version,
        id: version.id
      }
      return res.json({
        type: 'versionUpdate',
        success: true,
        application: data
      })
    } else {
      show.debug('Version change failed!')
      return res.json({
        type: 'versionUpdate',
        success: false
      })
    }
  })
}

/**
 * Application remove
 */
action.versionRemove = (req, res, next) => {
  const data = req.body
  show.debug('Removing Version...')
  versionRemove(data, (err) => {
    if (!err) {
      show.debug('Version remove success!')
      return res.json({
        type: 'versionRemove',
        success: true
      })
    } else {
      show.debug('Version remove failed!')
      return res.json({
        type: 'versionRemove',
        success: false
      })
    }
  })
}

/**
 * Application getOne
 */
action.versionGetOne = (req, res, next) => {
  const { id } = req.params
  show.debug('Get an Application...')
  versionGetOne(id, (err, version) => {
    if (!err) {
      show.debug('Version get success!')
      return res.json({
        type: 'version',
        success: true,
        version: version
      })
    } else {
      show.debug('Version got failed!')
      return res.json({
        type: 'version',
        success: false
      })
    }
  })
}

/**
 * Application getAll
 */
action.versionGetAll = (req, res, next) => {
  show.debug('Get all Version...')
  versionGetAll((err, versions) => {
    if (!err) {
      show.debug('Version got success!')
      return res.json({
        type: 'version',
        success: true,
        versions: versions
      })
    } else {
      show.debug('Version got failed!')
      return res.json({
        type: 'version',
        success: false
      })
    }
  })
}

module.exports = action
