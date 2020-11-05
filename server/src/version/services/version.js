/* eslint-disable indent */
'use strict'
const Version = require('../version.model')

/**
 * Create version
 * @function
 * @param {object} data
 * @param {function(*=, *=): (*)} callback
 */
const create = (data, callback) => {
    const { owner, version, servicesUrls, minVersion } = data

    const VersionData = new Version({
        owner, version, servicesUrls, minVersion
    })
    VersionData.save((err, typeData) => {
        if (!err && typeData) {
            return callback(null, typeData)
        } else {
            return callback(err)
        }
    })
}

/**
 * Update application
 * @function
 * @param {object} data
 * @param {callback} callback
 */
const update = async (data, callback) => {
    const { _id, version, servicesUrls, minVersion } = data
    Version.findOneAndUpdate(_id,
        {
            $set: {
                version,
                servicesUrls,
                minVersion
            }
        },
        {
            new: true
        },
        (err, type) => {
            if (!err && type) {
                return callback(null, type)
            } else {
                return callback(err)
            }
        }
    )
}

const get = (id, callback) => {
    Version.findById(id, (err, version) => {
        if (!err && version) {
            return callback(null, version)
        } else {
            return callback(err)
        }
    })
}

const getApllications = (callback) => {
    Version.find({}, (err, version) => {
        if (!err && version) {
            return callback(null, version)
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
    const { id } = data
    const query = { '_id': id }
    Version.deleteOne(query, (err) => {
        if (!err) {
            return callback(null)
        } else {
            return callback(err)
        }
    })
}

module.exports = {
    versionCreate: create,
    versionUpdate: update,
    versionRemove: remove,
    versionGetOne: get,
    versionGetAll: getApllications
}
