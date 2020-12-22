/* eslint-disable indent */
'use strict'
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

// /**
//  * Update application
//  * @function
//  * @param {object} data
//  * @param {callback} callback
//  */
// const update = async (data, callback) => {
//     const { name, apps } = data

//     User.findOneAndUpdate({ _id: name },
//         {
//             $push: {
//                 apps: {
//                     _id: apps._id
//                 }
//             }
//         },
//         {
//             new: true,
//             useFindAndModify: false
//         },
//         (err, userApp) => {
//             if (!err && userApp) {
//                 return callback(null, userApp)
//             } else {
//                 return callback(err)
//             }
//         }
//     )
// }

// const get = (id, callback) => {
//     User.findOne({ _id: id })
//     .populate('apps')
//     .exec(function (err, apps) {
//         if (err && !apps) {
//             const responseMsg = {
//                 code: 404,
//                 message: 'Ocurrio un error',
//                 description: 'Aplicacion-usuario no encontrada'
//             }
//             return callback(responseMsg, null)
//         } else {
//             return callback(null, apps.apps)
//         }
//     })
// }

// const getApllicationsByUser = (id, callback) => {
//     App.find({ 'users._id': { $in: id } }, (err, app) => {
//         if (!err && app) {
//             return callback(null, app)
//         } else {
//             return callback(err)
//         }
//     })
// }

// const getApllications = (callback) => {
//     App.find({}, (err, app) => {
//         if (!err && app) {
//             return callback(null, app)
//         } else {
//             return callback(err)
//         }
//     })
// }

// /**
//  * Remove application
//  * @function
//  * @param {object} data
//  * @param {callback} callback
//  */
// const remove = (data, callback) => {
//     const { appId, userId } = data
//     App.findOneAndUpdate({ _id: appId },
//         {
//             $pull: {
//                 users: {
//                     _id: userId
//                 }
//             }
//         },
//         {
//             new: true,
//             useFindAndModify: false
//         },
//         (err, userApp) => {
//             if (!err && userApp) {
//                 return callback(null, userApp)
//             } else {
//                 return callback(err)
//             }
//         }
//     )
// }

module.exports = {
    userAppCreate: create
    // userAppUpdate: update,
    // userAppRemove: remove,
    // userAppGetOne: get
    // userAppGetAllByUser: getApllicationsByUser,
    // userAppGetAll: getApllications
}
