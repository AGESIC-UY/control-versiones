'use strict'

const express = require('express')
const router = express.Router()
const auth = require('../src/auth')
const protect = require('./protect')

router.post('/check', protect, auth.check)
router.post('/login/local', auth.login)
router.post('/logout', auth.logout)
router.put('/registration', protect, auth.registration)
router.post('/registration/finish', protect, auth.finish)
router.post('/activation', auth.activation)
router.post('/recovery', auth.recovery)

module.exports = router
