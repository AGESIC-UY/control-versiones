'use strict'

process.env.NODE_ENV = 'test'
require('dotenv').config()
const expect = require('chai').expect
const auth = require('./index')
let chai = require('chai')
const { config } = require('../config')
const url = `http://${config.host}:${config.port}/api/`

const userCredentials = {
  'email': process.env.SUPER_ADMIN_EMAIL,
  'password': process.env.SUPER_ADMIN_PASSWORD
}

describe('Auth', () => {
  it('should get auth object', () => {
    expect(auth).to.be.an('object')
  })
})

beforeEach(function (done) {
  chai.request(url)
    .post('auth/login/local')
    .send(userCredentials)
    .end((_err, res) => {
      chai.expect(res).to.have.status(200)
      chai.expect(res.body.success).equal(true)
      expect(res.body).to.be.a('object')
      expect(res.body).to.have.property('user')
      expect(res.body).to.have.property('success').to.equal(true)

      done()
    })
})
