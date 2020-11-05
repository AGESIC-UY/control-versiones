/* eslint-disable indent */
'use strict'
const md5 = require('md5')
const Application = require('../application.model')
const Type = require('../../type/type.model')

/**
 * Create application
 * @function
 * @param {object} data
 * @param {function(*=, *=): (*)} callback
 */
const create = (data, callback) => {
    const { name, version, type, description } = data
    const md5Identifier = md5(name + version + type + description)
    // version should be included within this block of code below
    Type.findById(type)
        .then(typeId => {
            const applicationData = new Application({
                version,
                identifier: md5Identifier,
                description,
                type: typeId,
                name
            })
            applicationData.save((err, applicationData) => {
                if (!err && applicationData) {
                    return callback(null, applicationData)
                } else {
                    console.debug(err)
                    return callback(err)
                }
            })
        })
}

/**
 * Update application
 * @function
 * @param {object} data
 * @param {callback} callback
 */
const update = async (data, callback) => {
    const { _id, name, type, version, description } = data

    Application.findOneAndUpdate(_id,
        {
            $set: {
                description,
                version,
                name,
                type
            }
        },
        {
            new: true
        },
        (err, application) => {
            if (!err && application) {
                return callback(null, application)
            } else {
                return callback(err)
            }
        }
    )
}

const get = (id, callback) => {
    Application.findById(id, (err, application) => {
        if (!err && application) {
            return callback(null, application)
        } else {
            return callback(err)
        }
    })
}

const getApllications = (callback) => {
    Application.find({}, (err, application) => {
        if (!err && application) {
            return callback(null, application)
        } else {
            return callback(err)
        }
    }).populate('Type', 'Version')
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
    Application.deleteOne(query, (err) => {
        if (!err) {
            return callback(null)
        } else {
            return callback(err)
        }
    })
}

module.exports = {
    applicationCreate: create,
    applicationUpdate: update,
    applicationRemove: remove,
    applicationGetOne: get,
    applicationGetAll: getApllications
}
