'use strict'

const express = require('express')
const router = express.Router()
const version = require('../src/version')
// const protect = require('./protect')

router.get('/:id', version.versionGetOne)
router.get('/all/versions', version.versionGetAll)
router.post('/create', version.versionCreate)
router.post('/update', version.versionUpdate)
router.delete('/remove', version.versionRemove)

module.exports = router
