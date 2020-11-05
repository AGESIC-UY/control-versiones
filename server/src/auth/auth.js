'use strict'

const local = require('./services/local')
const logout = require('./services/logout')
const password = require('./services/password')
const { activate } = require('./services/activate')
const { recovery, recoveryHash } = require('./services/recovery')
const mail = require('../common/services/email')
const { config, show } = require('../config')
const action = {}

/**
 * Check login
 */
action.check = (req, res) => {
  show.debug('Checking login status...')
  if (req.isAuthenticated()) {
    show.debug('Logged in!')
    const { user } = req
    const data = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      age: user.age,
      location: user.location,
      active: user.active,
      role: user.role
    }
    res.json({
      success: true,
      user: data
    })
  } else {
    show.debug('Not logged in!', res.body)
    const data = {
      success: false
    }
    res.json(data)
  }
}

/**
 * Login
 */
action.login = (req, res, next) => {
  show.debug('Logging in...')
  local.login(req, res, next, (err, user) => {
    if (!err && user) {
      show.debug('Login success!')
      const data = {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        age: user.age,
        location: user.location,
        active: user.active,
        role: user.role
      }
      return res.json({
        type: 'login',
        success: true,
        user: data
      })
    } else if (!err && !user) {
      show.debug('User not found!')
      return res.json({
        type: 'login',
        success: false
      })
    } else {
      show.debug('Login error!')
      return res.json({
        type: 'login',
        success: false
      })
    }
  })
}

/**
 * Logout
 */
action.logout = (req, res, next) => {
  show.debug('Logging out...')
  logout(req, (err) => {
    if (!err) {
      show.debug('Logout success!')
      return res.json({
        type: 'logout',
        success: true
      })
    } else {
      show.debug('Logout failed!')
      return res.json({
        type: 'logout',
        success: false
      })
    }
  })
}

/**
 * Registration
 */
action.registration = (req, res, next) => {
  show.debug('Registrating...')
  const data = req.body
  console.log('Params regist', data)
  local.register(data, (err, user) => {
    if (!err && user) {
      show.debug('Registration success!')
      mail.send({
        to: data.email,
        subject: 'Building Blocks | Registration',
        content: '<h1>Welcome ' + data.name + '!</h1>Successfully registered!<h2><a href="' + config.url + '/activation/' + user.activation + '" target="_new">Activate account</a></h2>'
      }, (error, sent) => {
        if (!error && sent) {
          return res.json({
            type: 'registration',
            success: true
          })
        } else {
          return res.json({
            type: 'registration',
            success: true
          })
        }
      })
    } else {
      show.debug('Registration failed!')
      return res.json({
        type: 'registration',
        success: false
      })
    }
  })
}

/**
 * Registration finish (set password)
 */
action.finish = (req, res, next) => {
  const data = req.body
  show.debug('Setting password...')
  password.set(data, (err, user) => {
    if (!err && user) {
      show.debug('Password set up success!')
      const data = {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        age: user.age,
        location: user.location,
        active: user.active,
        role: user.role
      }
      return res.json({
        type: 'finish',
        success: true,
        user: data
      })
    } else {
      show.debug('Password set up failed!', err)
      return res.json({
        type: 'finish',
        success: false
      })
    }
  })
}

/**
 * Activation
 */
action.activation = (req, res, next) => {
  const data = req.body
  show.debug('Activating...')
  activate(data, (err, user) => {
    if (!err && user) {
      show.debug('Activation success!')
      return res.json({
        type: 'activation',
        success: true
      })
    } else {
      show.debug('Activation failed!')
      return res.json({
        type: 'activation',
        success: false
      })
    }
  })
}

/**
 * Password reset
 */
action.recovery = (req, res, next) => {
  const data = req.body
  show.debug('Recovery...')
  if (!data.hash) {
    recovery(data, (err, user) => {
      if (!err && user) {
        mail.send({
          to: user.email,
          subject: 'N-R-B | Recovery',
          content: '<h1>Recovery</h1>Click this link to reset your password: <a href="' + config.url + '/recovery/' + user.recovery + '" target="_new">Reset password</a>'
        }, (err, sent) => {
          if (!err && sent) {
            show.debug('Recovery success!')
            return res.json({
              type: 'recovery',
              success: true
            })
          } else {
            show.debug('Recovery failed!')
            return res.json({
              type: 'recovery',
              success: false
            })
          }
        })
      } else {
        show.debug('Recovery failed!')
        return res.json({
          type: 'recovery',
          success: false
        })
      }
    })
  } else {
    recoveryHash(data, (err, user) => {
      if (!err && user) {
        show.debug('Recovery success!')
        return res.json({
          type: 'recovery',
          success: true
        })
      } else {
        show.debug('Recovery failed!')
        return res.json({
          type: 'recovery',
          success: false
        })
      }
    })
  }
}

module.exports = action
