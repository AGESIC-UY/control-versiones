'use strict'
const {
  userAppCreate
  // userAppUpdate,
  // userAppRemove,
  // userAppGetOne
  // userAppGetAllByUser,
  // userAppGetAll
} = require('./services/userApp')
const { show } = require('../config')
const action = {}

/**
 * Version Create
 */
action.userAppCreate = (req, res, next) => {
  const data = req.body
  show.debug('Add App-User ...')
  userAppCreate(data, (err, userApp) => {
    if (!err && userApp) {
      show.debug('App-User created!')
      return res.json({
        code: 200,
        message: 'Exito',
        description: 'App-User creada correctamente',
        userApp: userApp.id
      })
    } else {
      show.debug('App-User create failed!', err.errors)
      return res.json({
        code: 422,
        message: 'Ocurrió un error',
        description: 'Usuario, Aplicacion son requeridos'
      })
    }
  })
}

/**
 * Version Update
 */
// action.userAppUpdate = (req, res, next) => {
//   const data = req.body
//   show.debug('Changing App-User...')
//   userAppUpdate(data, (err, userApp) => {
//     console.debug(err)

//     if (!err && userApp) {
//       show.debug('App-User change success!')
//       const data = {
//         id: userApp.id,
//         users: userApp.users
//       }
//       return res.json({
//         code: 200,
//         message: 'Exito',
//         description: 'App-User actualizada correctamente',
//         userApp: data
//       })
//     } else {
//       show.debug('App-User change failed!')
//       return res.json({
//         code: 422,
//         message: 'Ocurrió un error',
//         description: 'No se encontro Usuario o Aplicacion'
//       })
//     }
//   })
// }

/**
 * Version remove
 */
// action.userAppRemove = (req, res, next) => {
//   const data = req.body
//   show.debug('Removing App-User...')
//   userAppRemove(data, (err) => {
//     if (!err) {
//       show.debug('App-User remove success!')
//       return res.json({
//         code: 200,
//         message: 'Exito',
//         description: 'App-User removida con exito'
//       })
//     } else {
//       show.debug('App-User remove failed!')
//       return res.json({
//         code: 404,
//         message: 'Ocurrió un error',
//         description: 'App-User no encontrada'
//       })
//     }
//   })
// }

/**
 * Version getOne
 */
// action.userAppGetOne = (req, res, next) => {
//   const { id } = req.params
//   show.debug('Get an App-User...')
//   userAppGetOne(id, (err, userApp) => {
//     if (!err && userApp) {
//       show.debug('App-User get success!')
//       return res.json({
//         code: 200,
//         message: 'Exito',
//         description: 'App-User encontrada con exito',
//         userApp: userApp
//       })
//     } else {
//       show.debug('App-User got failed!')
//       return res.json({
//         code: 404,
//         message: 'Ocurrio un error',
//         description: 'App-User no encontrada'
//       })
//     }
//   })
// }

// /**
//  * Version getAll
//  */
// action.userAppGetAll = (req, res, next) => {
//   show.debug('Get all App-User...')
//   userAppGetAll((err, userApp) => {
//     if (!err && userApp.length > 0) {
//       show.debug('App-User got success!')
//       return res.json({
//         code: 200,
//         message: 'Exito',
//         description: 'App-User encontradas con exito',
//         userApp: userApp
//       })
//     } else {
//       show.debug('App-User got failed!')
//       return res.json({
//         code: 404,
//         message: 'Ocurrio un error',
//         description: 'No se encontraron App-User'
//       })
//     }
//   })
// }

// /**
//  * Version getAllByUser
//  */
// action.userAppGetAllByUser = (req, res, next) => {
//   const { id } = req.params
//   show.debug('Get all App by user...')
//   userAppGetAllByUser(id, (err, userApp) => {
//     if (!err && userApp.length > 0) {
//       show.debug('App-User got success!')
//       return res.json({
//         code: 200,
//         message: 'Exito',
//         description: 'App-User encontradas con exito',
//         userApp: userApp
//       })
//     } else {
//       show.debug('App-User got failed!')
//       return res.json({
//         code: 404,
//         message: 'Ocurrio un error',
//         description: 'No se encontraron App-User'
//       })
//     }
//   })
// }

module.exports = action
