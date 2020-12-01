'use strict'

const User = require('../user.model')
const Application = require('../../application/application.model')

/**
 * Update user
 * @function
 * @param {object} data
 * @param {callback} callback
 */
const update = (data, callback) => {
  const { id, username, name, email, age, location } = data
  User.findOneAndUpdate({ id, email, active: true },
    {
      $set: {
        username,
        name,
        age,
        location
      }
    },
    {
      new: true
    },
    (err, user) => {
      if (!err && user) {
        return callback(null, user)
      } else {
        return callback(err)
      }
    }
  )
}

/**
 * Remove user
 * @function
 * @param {object} data
 * @param {callback} callback
 */
const remove = (data, callback) => {
  const { id, email } = data
  User.deleteOne({ id, email }, (err) => {
    if (!err) {
      return callback(null)
    } else {
      return callback(err)
    }
  })
}

const get = (data, callback) => {
  const id = data
  User.findById(id, (err, user) => {
    if (!err && user) {
      return callback(null, user)
    } else {
      return callback(err)
    }
  })
}

const getAll = (callback) => {
  console.debug('Getting all users')

  User.find({})
    .populate('apps')
    .exec(function (err, users) {
      if (err || users === null) {
        return callback(err)
      } else {
        return callback(null, users)
      }
    })
}

module.exports = {
  profileUpdate: update,
  profileRemove: remove,
  userGetOne: get,
  userGetAll: getAll
}
