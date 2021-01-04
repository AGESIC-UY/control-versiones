'use strict'

process.env.NODE_ENV = 'test'
require('dotenv').config()
let chai = require('chai')
let chaiHttp = require('chai-http')
const { config } = require('../config')
chai.use(chaiHttp)

const url = `http://${config.host}:${config.port}/api/`

const userCredentials = {
  'email': process.env.SUPER_ADMIN_EMAIL,
  'password': process.env.SUPER_ADMIN_PASSWORD
}

const app = {
  name: 'Application for version test',
  description: 'Just a test application description'
}

let loginCookie
let appReference
let versionReference

describe('Version', () => {
  before(() => {
    chai.request(url)
      .post('auth/login/local')
      .send(userCredentials)
      .end((_err, res) => {
        chai.expect(res).to.have.status(200)
        chai.expect(res.body.success).equal(true)
        chai.expect(res.body).to.be.a('object')
        chai.expect(res.body).to.have.property('user')
        chai.expect(res.body).to.have.property('success').to.equal(true)
        loginCookie = res.headers['set-cookie']
      })
  })

  describe('/POST version', () => {
    it('it should not be authorize to create version', (done) => {
      chai.request(url)
        .post('application/create')
        .set('Cookie', loginCookie)
        .send(app)
        .end((_err, res) => {
          appReference = res.body.application
          const version = { version: '1.0.0', servicesUrls: ['https://www.gub.uy/'], minVersion: '1.0.0', owner: res.body.application }
          chai.request(url)
            .post('version/create')
            .send(version)
            .end((_err, res) => {
              chai.expect(res.error).to.have.status(401)
              chai.expect(res.error).to.have.property('text').to.equal('Not authorized request!')
              chai.request(url)
                .delete('application/remove')
                .set('Cookie', loginCookie)
                .send({ id: appReference })
                .end(function (_err, res) {
                })
            })
          done()
        })
    })

    it('it should create version', (done) => {
      app.name = 'App version 2'
      chai.request(url)
        .post('application/create')
        .set('Cookie', loginCookie)
        .send(app)
        .end((_err, res) => {
          appReference = res.body.application
          const version = { version: '1.0.0', servicesUrls: ['https://www.gub.uy/'], minVersion: '1.0.0', owner: appReference }
          chai.request(url)
            .post('version/create')
            .set('Cookie', loginCookie)
            .send(version)
            .end((_err, res) => {
              versionReference = res.body.version
              chai.expect(res.body).to.be.a('object')
              chai.expect(res.body).to.have.property('code').to.equal(200)
              chai.expect(res.body.message).equal('Exito')
              chai.expect(res.body.description).equal('Version creada correctamente')
              chai.expect(res.body).to.have.property('version').to.be.a('string')
              done()
            })
        })
    })
  })

  describe('/UPDATE version', () => {
    it('it should not be authorize to update the version', (done) => {
      chai.request(url)
        .post('version/update')
        .send({ id: versionReference, version: '1.0.1', minVersion: '1.0.0' })
        .end(function (_err, res) {
          chai.expect(res.error).to.have.status(401)
          chai.expect(res.error).to.have.property('text').to.equal('Not authorized request!')
          done()
        })
    })

    it('it should update the type', (done) => {
      chai.request(url)
        .post('version/update')
        .set('Cookie', loginCookie)
        .send({ id: versionReference, version: '1.0.1', minVersion: '1.0.0' })
        .end(function (_err, res) {
          chai.expect(res.body).to.be.a('object')
          chai.expect(res.body).to.have.property('code').to.equal(200)
          chai.expect(res.body.message).equal('Exito')
          chai.expect(res.body.description).equal('Version actualizada correctamente')
          chai.expect(res.body).to.have.property('version').to.be.a('object')
          done()
        })
    })
  })

  describe('/GET Version', () => {
    it('it should not be authorize to get the version', (done) => {
      chai.request(url)
        .get(`version/${versionReference}`)
        .end(function (_err, res) {
          chai.expect(res.error).to.have.status(401)
          chai.expect(res.error).to.have.property('text').to.equal('Not authorized request!')
          done()
        })
    })

    it('it should not found and get the type', (done) => {
      chai.request(url)
        .get('version/00000000')
        .set('Cookie', loginCookie)
        .end(function (_err, res) {
          chai.expect(res.body).to.be.a('object')
          chai.expect(res.body).to.have.property('code').to.equal(404)
          chai.expect(res.body.message).equal('Ocurrio un error')
          chai.expect(res.body.description).equal('Version no encontrada')
          done()
        })
    })

    it('it should get the version', (done) => {
      chai.request(url)
        .get(`version/${versionReference}`)
        .set('Cookie', loginCookie)
        .end(function (_err, res) {
          chai.expect(res.body).to.be.a('object')
          chai.expect(res.body).to.have.property('code').to.equal(200)
          chai.expect(res.body.message).equal('Exito')
          chai.expect(res.body.description).equal('Version encontrada con exito')
          chai.expect(res.body).to.have.property('version').to.be.a('object')
          done()
        })
    })

    it('it should get all versions', (done) => {
      chai.request(url)
        .get('version/all/versions')
        .set('Cookie', loginCookie)
        .end(function (_err, res) {
          chai.expect(res.body).to.be.a('object')
          chai.expect(res.body).to.have.property('code').to.equal(200)
          chai.expect(res.body.message).equal('Exito')
          chai.expect(res.body.description).equal('Versiones encontradas con exito')
          chai.expect(res.body).to.have.property('versions').to.be.a('array')
          done()
        })
    })
  })

  describe('/REMOVE Version', () => {
    it('it should not be authorize to remove the version', (done) => {
      chai.request(url)
        .delete('version/remove')
        .send({ id: versionReference })
        .end(function (_err, res) {
          chai.expect(res.error).to.have.status(401)
          chai.expect(res.error).to.have.property('text').to.equal('Not authorized request!')
          done()
        })
    })

    it('it should remove the version', (done) => {
      chai.request(url)
        .delete('version/remove')
        .set('Cookie', loginCookie)
        .send({ id: { _id: versionReference }, appId: appReference })
        .end(function (_err, res) {
          chai.expect(res.body).to.be.a('object')
          chai.expect(res.body).to.have.property('code').to.equal(200)
          chai.expect(res.body.message).equal('Exito')
          chai.expect(res.body.description).equal('Version removida con exito')
          chai.request(url)
            .delete('application/remove')
            .set('Cookie', loginCookie)
            .send({ id: appReference })
            .end(function (_err, res) {
              done()
            })
        })
    })
  })
})
