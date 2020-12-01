'use strict'

const express = require('express')
const router = express.Router()
const app = require('../src/application')
const protect = require('./protect')

router.get('/:id', app.applicationGetOne)
router.get('/all/applications', protect, app.applicationGetAll)
router.post('/create', protect, app.applicationCreate)
router.post('/update', protect, app.applicationUpdate)
router.delete('/remove', protect, app.applicationRemove)
router.get('/mobile/app', app.applicationFromMobile)
router.post('/create-all', app.applicationCreateAll)
router.get('/all/relevant', protect, app.applicationGetRelevant)

module.exports = router
