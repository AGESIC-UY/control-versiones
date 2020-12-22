'use strict'

const express = require('express')
const router = express.Router()
const userApp = require('../src/userApp')
const protect = require('./protect')

// router.get('/:id', protect, userApp.userAppGetOne)
// router.get('/all/userApps/:id', protect, userApp.userAppGetAllByUser)
// router.get('/all/userApps', protect, userApp.userAppGetAll)
router.post('/create', protect, userApp.userAppCreate)
// router.post('/update', protect, userApp.userAppUpdate)
// router.delete('/remove', protect, userApp.userAppRemove)

module.exports = router
