process.env.NODE_ENV = 'development'
const User = require('../src/auth/services/local')
const UserModel = require('../src/user/user.model')
const config = require('../src/config/services/config')
var mongoose = require('mongoose')
mongoose.connect(config.mongoUrl, { useNewUrlParser: true }, (err) => {
  if (!err) { console.log('mongo started') }
})
try {
  module.exports.init = function () {
    UserModel.findOne({ email: 'superadmin@gub.uy' })
      .exec(function (err, app) {
        if (err || app === null) {
          User.register({
            'username': process.env.SUPER_ADMIN_USERNAME,
            'name': process.env.SUPER_ADMIN_NAME,
            'email': process.env.SUPER_ADMIN_EMAIL,
            'location': 'Pocitos, Montevideo',
            'password': process.env.SUPER_ADMIN_PASSWORD,
            'role': process.env.SUPER_ADMIN_ROLE
          }, (err, user) => {
            if (!err && user) {
              console.debug('Registration success!')
              process.exit()
            } else {
              console.debug('Registration failed!')
            }
          })
        }
      })
  }
  module.exports.activate = function () {
    UserModel.findOneAndUpdate({ email: 'superadmin@gub.uy' },
      {
        active: true
      },
      {
        returnNewDocument: true,
        useFindAndModify: false
      })
      .exec(function (err, user) {
        if (!err && user) {
          console.debug('User activated')
          process.exit()
        } else {
          console.debug('Err', err)
        }
      })
  }
} catch (error) {
  console.log('ERR', error)
}
