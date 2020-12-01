'use strict'

const express = require('express')
const router = express.Router()
const version = require('../src/version')
const protect = require('./protect')

router.get('/:id', protect, version.versionGetOne)
router.get('/all/versions', protect, version.versionGetAll)
router.post('/create', protect, version.versionCreate)
router.post('/update', protect, version.versionUpdate)
router.delete('/remove', protect, version.versionRemove)
router.get('/all/relevant', protect, version.getAllVersionsBasedOnRole)

module.exports = router
