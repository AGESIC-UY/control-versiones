'use strict'

const express = require('express')
const router = express.Router()
const type = require('../src/type')
// const protect = require('./protect')

router.get('/:id', type.typeGetOne)
router.get('/all/types', type.typeGetAll)
router.post('/create', type.typeCreate)
router.post('/update', type.typeUpdate)
router.delete('/remove', type.typeRemove)

module.exports = router
