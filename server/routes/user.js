'use strict'

const express = require('express')
const router = express.Router()
const user = require('../src/user')
const protect = require('./protect')

router.post('/passchange', protect, user.passChange)
router.post('/profileupdate', protect, user.profileUpdate)
router.delete('/profileremove', protect, user.profileRemove)
router.get('/:id', protect, user.UserGetOne)
router.get('/all/users', protect, user.userGetAll)

module.exports = router
