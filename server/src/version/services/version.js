/* eslint-disable indent */
'use strict'
const Version = require('../version.model')
const User = require('../../user/user.model')
const Application = require('../../application/application.model')

const mongoose = require('mongoose')
/**
 * Create version
 * @function
 * @param {object} data
 * @param {function(*=, *=): (*)} callback
 */
const create = (data, callback) => {
    const { owner, version, servicesUrls, minVersion } = data
    Application.findById(owner)
        .populate('versions')
        .exec(function (err, app) {
            if (!err && app) {
                if (app.versions.length > 0) {
                     if (app.versions.some(ver => ver.version === version)) {
                        err = {
                            code: 404,
                            message: 'Ocurrio un error',
                            description: 'Esta version ya existe'
                        }
                        return callback(err)
                     } else {
                        new Version({
                            owner, version, servicesUrls, minVersion
                        }).save((err, version) => {
                            if (!err && version) {
                                Application.findOneAndUpdate({ _id: owner },
                                    {
                                        $push: {
                                            versions: version._id
                                        }
                                    },
                                    {
                                        new: true
                                    }
                                ).exec(function (err, app) {
                                    if (!err && app) {
                                        console.debug('saved app', app)
                                    } else {
                                        console.log('err saving app', err)
                                    }
                                })
                                return callback(null, version)
                            } else {
                                return callback(err)
                            }
                        })
                     }
                } else {
                    new Version({
                        owner, version, servicesUrls, minVersion
                    }).save((err, version) => {
                        if (!err && version) {
                            Application.findOneAndUpdate({ _id: owner },
                                {
                                    $push: {
                                        versions: version._id
                                    }
                                },
                                {
                                    new: true
                                }
                            ).exec(function (err, app) {
                                if (!err && app) {
                                    console.debug('saved app', app)
                                } else {
                                    console.log('err saving app', err)
                                }
                            })
                            return callback(null, version)
                        } else {
                            return callback(err)
                        }
                    })
                }
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
    const { _id, version, servicesUrls, minVersion, owner } = data
    Version.findOneAndUpdate(_id,
        {
            $set: {
                version,
                servicesUrls,
                minVersion,
                owner
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

const getVersionsBasedOnApp = (id, callback) => {
    Version.findOne().sort({ field: 'desc', _id: -1 }).limit(1).exec(function (err, versions) {
        if (err) {
            return callback(err)
        } else {
            return callback(null, versions)
        }
    })
}

const getAllVersions = (callback) => {
    Version.find({}, (err, version) => {
        if (!err && version) {
            return callback(null, version)
        } else {
            return callback(err)
        }
    })
}

const getAllVersionsBasedOnRole = (data, callback) => {
    const { id } = data

    User.findById(id)
        .populate({
            path: 'apps',
            populate: {
                path: 'versions',
                model: 'Version'
            }
        })
        .exec(function (err, apps) {
            if (err) {
                return callback(err)
            } else {
                return callback(null, apps.apps[0].versions.length !== 0 ? apps.apps[0].versions : null)
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
    const { id, appId } = data
    const query = { '_id': id._id }
    Application.findOneAndUpdate(
                { _id: appId },
                { $pull: { versions: id._id } },
                { new: true },
        (err, userApp) => {
            if (!err && userApp) {
                Version.deleteOne(query, (err) => {
                    if (!err) {
                        return callback(null)
                    } else {
                        return callback(err)
                    }
                })
                // return callback(null, userApp)
            } else {
                return callback(err)
            }
        }
        )


}

module.exports = {
    versionCreate: create,
    versionUpdate: update,
    versionRemove: remove,
    versionGetOne: get,
    versionGetAll: getAllVersions,
    getVersionBasedOnApp: getVersionsBasedOnApp,
    getAllVersionsBasedOnRole: getAllVersionsBasedOnRole
}
