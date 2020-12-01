'use strict'

const express = require('express')
const router = express.Router()
const type = require('../src/type')
const protect = require('./protect')

router.get('/:id', protect, type.typeGetOne)
router.get('/all/types', protect, type.typeGetAll)
router.post('/create', protect, type.typeCreate)
router.post('/update', protect, type.typeUpdate)
router.delete('/remove', protect, type.typeRemove)

module.exports = router
