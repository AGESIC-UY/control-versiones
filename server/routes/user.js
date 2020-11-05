'use strict'

const express = require('express')
const router = express.Router()
const user = require('../src/user')
// const protect = require('./protect')

router.post('/passchange', user.passChange)
router.post('/profileupdate', user.profileUpdate)
router.delete('/profileremove', user.profileRemove)
router.get('/:id', user.UserGetOne)
router.get('/all/users', user.userGetAll)

module.exports = router
