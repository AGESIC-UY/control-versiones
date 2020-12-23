const User = require('../src/auth/services/local')
const UserModel = require('../../server/src/user/user.model')

UserModel.findOne({ email: 'superadmin@gub.uy' })
  .exec(function (err, app) {
    if (err || app === null) {
      User.register({
        'username': 'Agesic',
        'name': 'Agesic super admin',
        'email': 'superadmin@gub.uy',
        'location': 'Pocitos, Montevideo',
        'password': 'qwerty12345',
        'role': 'superAdmin'
      }, (err, user) => {
        if (!err && user) {
          console.debug('Registration success!')
        } else {
          console.debug('Registration failed!')
        }
      })
      UserModel.findOneAndUpdate({ email: 'superadmin@gub.uy' },
        {
          active: true
        },
        {
          new: true,
          useFindAndModify: false
        },
        (err, user) => {
          if (!err && user) {
            console.debug('User activated', user)
          } else {
            console.debug('Err', err)
          }
        }
      )
    }
  })
