/* eslint-disable indent */
'use strict'
const App = require('../../application/application.model')
const User = require('../../user/user.model')
/**
 * Create version
 * @function
 * @param {object} data
 * @param {function(*=, *=): (*)} callback
 */
const create = (data, callback) => {
    const { id, apps } = data
    User.findOneAndUpdate({ _id: id },
        {
            $set: {
                 apps: apps.map(app => app._id)
            }
        },
        {
            new: true,
            useFindAndModify: false
        },
        (err, userApp) => {
            if (!err && userApp) {
                return callback(null, userApp)
            } else {
                return callback(err)
            }
        }
    )
}

/**
 * Update application
 * @function
 * @param {object} data
 * @param {callback} callback
 */
const update = async (data, callback) => {
    const { name, apps } = data

    User.findOneAndUpdate({ _id: name },
        {
            $push: {
                apps: {
                    _id: apps._id
                }
            }
        },
        {
            new: true,
            useFindAndModify: false
        },
        (err, userApp) => {
            if (!err && userApp) {
                return callback(null, userApp)
            } else {
                return callback(err)
            }
        }
    )
}

const get = (id, callback) => {
    App.find({ 'users._id': { $in: id } }, (err, version) => {
        if (!err && version) {
            return callback(null, version)
        } else {
            return callback(err)
        }
    })
}

const getApllicationsByUser = (id, callback) => {
    App.find({ 'users._id': { $in: id } }, (err, app) => {
        if (!err && app) {
            return callback(null, app)
        } else {
            return callback(err)
        }
    })
}

const getApllications = (callback) => {
    App.find({}, (err, app) => {
        if (!err && app) {
            return callback(null, app)
        } else {
            return callback(err)
        }
    })
}

/**
 * Remove application
 * @function
 * @param {object} data
 * @param {callback} callback
 */
const remove = (data, callback) => {
    const { appId, userId } = data
    App.findOneAndUpdate({ _id: appId },
        {
            $pull: {
                users: {
                    _id: userId
                }
            }
        },
        {
            new: true,
            useFindAndModify: false
        },
        (err, userApp) => {
            console.debug('app delete user --->', userApp)
            if (!err && userApp) {
                return callback(null, userApp)
            } else {
                return callback(err)
            }
        }
    )
}

module.exports = {
    userAppCreate: create,
    userAppUpdate: update,
    userAppRemove: remove,
    userAppGetOne: get,
    userAppGetAllByUser: getApllicationsByUser,
    userAppGetAll: getApllications
}
