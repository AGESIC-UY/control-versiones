/* eslint-disable indent */
'use strict'
const md5 = require('md5')
const Application = require('../application.model')
const User = require('../../user/user.model')
const Type = require('../../type/type.model')
const Version = require('../../version/version.model')
// const { getVersionBasedOnApp } = require('../version/services/version')

/**
 * Create application
 * @function
 * @param {object} data
 * @param {function(*=, *=): (*)} callback
 */
const create = (data, callback) => {
    const { name, version, type, description } = data
    const md5Identifier = md5(name + description + Math.random().toString(36).substring(7))
    Application.exists({ name: name }, (err, appExists) => {
        if (appExists) {
            err = 'Nombre ya ha sido registrado'
            callback(err)
        } else {
            const applicationData = new Application({
                version,
                identifier: md5Identifier,
                description,
                type: type,
                name
            })
            applicationData.save((err, applicationData) => {
                if (!err && applicationData) {
                    return callback(null, applicationData)
                } else {
                    return callback(err)
                }
            })
        }
    })
}

/**
 * Create application type and version
 * @function
 * @param {object} data
 * @param {function(*=, *=): (*)} callback
 */
const createAll = (data, callback) => {
    const { name, description, version: { minVersion, servicesUrls, version }, type } = data
    const md5Identifier = md5(name + Math.random().toString(36).substring(7))
    let responseMsg = {
        code: 422,
        message: 'Ocurrió un error',
        description: 'Aplicacion: el nombre ya ha sido registrado'
    }
    Application.exists({ name: name }, (_err, appExists) => {
        if (appExists) {
            callback(responseMsg)
        } else {
            const typeData = new Type({
                name: type
            })
            typeData.save((err, doc) => {
                if (err) {
                    responseMsg.description = 'Tipo: Nombre es requerido'
                    return callback(responseMsg, null)
                }
                const applicationData = new Application({
                    identifier: md5Identifier,
                    description,
                    type: typeData._id,
                    name
                })
                applicationData.save((err, applicationData) => {
                    if (err) {
                        responseMsg.description = 'Aplicacion: No se propocionaron datos requeridos o estos son mas cortos que 5 caracteres o mayores a 100'
                        return callback(responseMsg, null)
                    } else {
                        const versionData = new Version({
                            owner: applicationData._id,
                            version: version,
                            servicesUrls: servicesUrls,
                            minVersion: minVersion
                      })
                      versionData.save((err, versionData) => {
                        if (!err && versionData) {
                            return callback(null, versionData)
                        } else {
                            responseMsg.description = 'Version: No se propocionaron datos requeridos o estos son mas cortos que 5 caracteres o mayores a 100'
                            return callback(responseMsg, null)
                        }
                    })
                    }
                })
            })
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
    const { _id, type, version, description } = data
    let typeId = type._id
        Application.findByIdAndUpdate(_id,
            {
                description: description,
                version: version,
                type: typeId
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
    Application.findOne({ name: id })
    .populate({ path: 'type' })
    .populate({ path: 'version' })
    .exec(function (err, app) {
        const versionArr = []
        if (err) {
            console.log('there is an error', err)
            return callback(err)
        } else {
            Version.find({ owner: app._id }, (err, versions) => {
                if (err) {
                    console.debug(err)
                } else {
                    versionArr.push(versionArr[0])
                }
              }).sort({ 'updatedAt': 'desc' })

            return callback(null, app)
        }
    })
}

const getApp = async (data, callback) => {
    const { name, version } = data
    const responseMsg = {
        code: 404,
        message: 'Ocurrio un error',
        description: 'Aplicacion no encontrada'
    }
    let versionValue = version
    Application.findOne({ name: name })
    .populate({ path: 'type' }).lean()
    .exec(function (_err, app) {
        if (app === null) {
            return callback(responseMsg, null)
        } else {
            Version.findOne({ owner: app._id, version: version }, async (err, version) => {
                if (version !== null && err === null) {
                    if (versionValue < version.minVersion) {
                        app['version'] = version
                        delete app.versions
                        responseMsg.code = 200
                        responseMsg.message = 'Actualizar'
                        responseMsg.description = 'Tu version esta desactualizada'
                        responseMsg['app'] = app
                        return callback(null, responseMsg)
                    } else {
                        app['version'] = version
                        delete app.versions
                        responseMsg.code = 200
                        responseMsg.message = 'Exito'
                        responseMsg.description = 'Version encontrada'
                        responseMsg['app'] = app
                        return callback(null, responseMsg)
                    }
                } else {
                    Version.findOne({ owner: app._id }).sort({ 'updatedAt': 'desc' }).limit(1).exec(function (_err, version) {
                        if (version === null) {
                            responseMsg.code = 404
                            responseMsg.message = 'Ocurrio un error'
                            responseMsg.description = 'No se encontro ninguna version registrada'
                            return callback(responseMsg, null)
                        } else {
                            app['version'] = version
                            delete app.versions
                            responseMsg.code = 200
                            responseMsg.message = 'Exito'
                            responseMsg.description = 'No se encontro version, se proporciona los datos de la última version registrada'
                            responseMsg['app'] = app
                            return callback(responseMsg, null)
                        }
                    })
                }
              })
        }
    })
}

const getApllications = (callback) => {
    Application.find({})
    .populate({ path: 'type' })
    .populate({ path: 'version' })
    .exec(function (err, apps) {
        if (err || apps === null) {
            return callback(err)
        } else {
            return callback(null, apps)
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
    Application.deleteOne(query, (err) => {
        if (!err) {
            return callback(null)
        } else {
            return callback(err)
        }
    })
}

const getRelevant = (data, callback) => {
    const { id } = data

    User.findById(id)
    .populate({
        path: 'apps',
        model: Application,
        populate: {
            path: 'type',
            model: Type
        }
    })
    .exec(function (err, apps) {
        if (err || apps === null) {
            return callback(err)
        } else {
            return callback(null, apps)
        }
    })
}

module.exports = {
    applicationCreate: create,
    applicationUpdate: update,
    applicationRemove: remove,
    applicationGetOne: get,
    applicationGetAll: getApllications,
    applicationFromMobile: getApp,
    applicationCreateAll: createAll,
    applicationGetRelevant: getRelevant
}
