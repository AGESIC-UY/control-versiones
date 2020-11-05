'use strict'

const express = require('express')
const router = express.Router()
const app = require('../src/application')
// const protect = require('./protect')

router.get('/:id', app.applicationGetOne)
router.get('/all/applications', app.applicationGetAll)
router.post('/create', app.applicationCreate)
router.post('/update', app.applicationUpdate)
router.delete('/remove', app.applicationRemove)

module.exports = router
