/* eslint-disable indent */
'use strict'

const Type = require('../type.model')

/**
 * Create type
 * @function
 * @param {object} data
 * @param {function(*=, *=): (*)} callback
 */
const create = (data, callback) => {
    const { id, name } = data

    const TypeData = new Type({
        id, name
    })
    TypeData.save((err, typeData) => {
        if (!err && typeData) {
            return callback(null, typeData)
        } else {
            return callback(err)
        }
    })
}

/**
 * Update type
 * @function
 * @param {object} data
 * @param {callback} callback
 */
const update = (data, callback) => {
    const { _id, name } = data
    Type.findOneAndUpdate(_id,
        {
            $set: {
                name
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

const get = (data, callback) => {
    const id = data
    Type.findById(id, (err, type) => {
        if (!err && type) {
            return callback(null, type)
        } else {
            return callback(err)
        }
    })
}

const getAll = (callback) => {
    console.debug('Getting all types')
    Type.find({}, (err, type) => {
        if (!err && type) {
            return callback(null, type)
        } else {
            return callback(err)
        }
    })
}

/**
 * Remove type
 * @function
 * @param {object} data
 * @param {callback} callback
 */
const remove = (data, callback) => {
    const { id } = data
    const query = { '_id': id }
    Type.deleteOne(query, (err) => {
        if (!err) {
            return callback(null)
        } else {
            console.debug(err)
            return callback(err)
        }
    })
}

module.exports = {
    typeCreate: create,
    typeUpdate: update,
    typeRemove: remove,
    typeGetOne: get,
    typeGetAll: getAll
}
