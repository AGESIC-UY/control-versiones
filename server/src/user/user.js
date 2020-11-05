'use strict'

const { profileUpdate, profileRemove, userGetOne, userGetAll } = require('./services/profile')
const { show } = require('../config')
const action = {}

/**
 * Password change
 */
action.passChange = (req, res, next) => {
  show.debug('Changing password...')
  return res.json({
    type: 'passchange',
    result: 'Not implemented!'
  })
}

/**
 * Profile change
 */
action.profileUpdate = (req, res, next) => {
  const data = req.body
  show.debug('Changing profile...')
  profileUpdate(data, (err, user) => {
    if (!err && user) {
      show.debug('Profile change success!')
      const data = {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        age: user.age,
        location: user.location,
        role: user.role
      }
      return res.json({
        type: 'profileupdate',
        success: true,
        user: data
      })
    } else {
      show.debug('Profile change failed!')
      return res.json({
        type: 'profileupdate',
        success: false
      })
    }
  })
}

/**
 * Profile remove
 */
action.profileRemove = (req, res, next) => {
  const data = req.body
  show.debug('Removing user...')
  profileRemove(data, (err) => {
    if (!err) {
      show.debug('Profile remove success!')
      return res.json({
        type: 'profileremove',
        success: true
      })
    } else {
      show.debug('Profile remove failed!')
      return res.json({
        type: 'profileremove',
        success: false
      })
    }
  })
}

/**
   * User getOne
   */
action.UserGetOne = (req, res, next) => {
  const data = req.params.id
  show.debug('Getting user...')
  userGetOne(data, (err, user) => {
    if (!err) {
      show.debug('User get success!', user)
      return res.json({
        user: 'userGetOne',
        success: true,
        userData: user
      })
    } else {
      show.debug('User got failed!')
      return res.json({
        type: 'userGetOne',
        success: false
      })
    }
  })
}

/**
     * User getAll
     */
action.userGetAll = (req, res, next) => {
  show.debug('Getting all users...')
  userGetAll((err, users) => {
    if (!err) {
      show.debug('Got Users successfully!')
      return res.json({
        type: 'userGetAll',
        success: true,
        TypeData: users
      })
    } else {
      show.debug('Getting Users failed!')
      return res.json({
        type: 'userGetAll',
        success: false
      })
    }
  })
}
module.exports = action
