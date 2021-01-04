'use strict'

process.env.NODE_ENV = 'test'
require('dotenv').config()
let chai = require('chai')
let chaiHttp = require('chai-http')
const { config } = require('../config')
const userApp = require('./services/userApp')
chai.use(chaiHttp)

const url = `http://${config.host}:${config.port}/api/`

const userCredentials = {
  'email': process.env.SUPER_ADMIN_EMAIL,
  'password': process.env.SUPER_ADMIN_PASSWORD
}

const app = {
  name: 'User Application test',
  description: 'Just a test application description'
}

let loginCookie
let userReference
let UserApp = { }

describe('UserApp', () => {
  before(() => {
    chai.request(url)
      .post('auth/login/local')
      .send(userCredentials)
      .end((_err, res) => {
        userReference = res.body.user
        chai.expect(res).to.have.status(200)
        chai.expect(res.body.success).equal(true)
        chai.expect(res.body).to.be.a('object')
        chai.expect(res.body).to.have.property('user')
        chai.expect(res.body).to.have.property('success').to.equal(true)
        loginCookie = res.headers['set-cookie']
      })
  })

  describe('/POST User app', () => {
    it('it should not be authorize to create the user app', (done) => {
      chai.request(url)
        .post('application/create')
        .set('Cookie', loginCookie)
        .send(app)
        .end((_err, res) => {
          chai.request(url)
            .get(`application/${app.name}`)
            .set('Cookie', loginCookie)
            .end(function (_err, res) {
              userApp['id'] = userReference._id
              userApp['apps'] = [res.body.application]

              chai.request(url)
                .post('userApp/create')
                .send(userApp)
                .end((_err, res) => {
                  chai.expect(res.error).to.have.status(401)
                  chai.expect(res.error).to.have.property('text').to.equal('Not authorized request!')
                  done()
                })
            })
        })
    })

    it('it should create the user app', (done) => {
      chai.request(url)
        .post('userApp/create')
        .set('Cookie', loginCookie)
        .send(userApp)
        .end((_err, res) => {
          chai.expect(res).to.have.status(200)
          chai.expect(res.body.message).equal('Exito')
          chai.expect(res.body).to.be.a('object')
          chai.expect(res.body.description).equal('App-User creada correctamente')
          chai.expect(res.body).to.have.property('userApp').to.be.a('string')
          done()
        })
    })
  })

  describe('/REMOVE User app', () => {
    it('it should not be authorize to remove the user app', (done) => {
      chai.request(url)
        .post('userApp/create')
        .send({ id: userApp.id, apps: [] })
        .end(function (_err, res) {
          chai.expect(res.error).to.have.status(401)
          chai.expect(res.error).to.have.property('text').to.equal('Not authorized request!')
          done()
        })
    })

    it('it should remove the user app', (done) => {
      chai.request(url)
        .post('userApp/create')
        .set('Cookie', loginCookie)
        .send({ id: userApp.id, apps: [] })
        .end(function (_err, res) {
          chai.expect(res.body).to.be.a('object')
          chai.expect(res.body).to.have.property('code').to.equal(200)
          chai.expect(res.body.message).equal('Exito')
          chai.expect(res.body.description).equal('App-User creada correctamente')
          chai.request(url)
            .delete('application/remove')
            .set('Cookie', loginCookie)
            .send({ id: userApp.apps[0]._id })
            .end(function (_err, res) {
              chai.expect(res.body).to.be.a('object')
              chai.expect(res.body).to.have.property('code').to.equal(200)
              chai.expect(res.body.message).equal('Exito')
              chai.expect(res.body.description).equal('Aplicacion removida con exito')
              done()
            })
        })
    })
  })
})
