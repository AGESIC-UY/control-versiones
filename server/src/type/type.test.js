'use strict'

process.env.NODE_ENV = 'test'
require('dotenv').config()
let chai = require('chai')
let chaiHttp = require('chai-http')
const { config } = require('../config')
const type = require('./services/type')
chai.use(chaiHttp)

const url = `http://${config.host}:${config.port}/api/`

const userCredentials = {
  'email': process.env.SUPER_ADMIN_EMAIL,
  'password': process.env.SUPER_ADMIN_PASSWORD
}

let loginCookie
let typeReference

describe('Type', () => {
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

  describe('/POST type', () => {
    it('it should not be authorize to create type', (done) => {
      const type = { name: 'mobile' }
      chai.request(url)
        .post('type/create')
        .send(type)
        .end((_err, res) => {
          chai.expect(res.error).to.have.status(401)
          chai.expect(res.error).to.have.property('text').to.equal('Not authorized request!')
          done()
        })
    })

    it('it should create type', (done) => {
      const type = { name: 'mobile' }
      chai.request(url)
        .post('type/create')
        .set('Cookie', loginCookie)
        .send(type)
        .end((_err, res) => {
          typeReference = res.body.type
          chai.expect(res.body).to.be.a('object')
          chai.expect(res.body).to.have.property('code').to.equal(200)
          chai.expect(res.body.message).equal('Exito')
          chai.expect(res.body.description).equal('Tipo creado correctamente')
          chai.expect(res.body).to.have.property('type').to.be.a('string')
          done()
        })
    })
  })

  describe('/UPDATE type', () => {
    it('it should not be authorize to update the type', (done) => {
      chai.request(url)
        .get(`type/${typeReference}`)
        .set('Cookie', loginCookie)
        .end(function (_err, res) {
          let typeData = res.body.type
          typeData.name = 'Desktop'
          chai.request(url)
            .post('type/update')
            .send(typeData)
            .end(function (_err, res) {
              chai.expect(res.error).to.have.status(401)
              chai.expect(res.error).to.have.property('text').to.equal('Not authorized request!')
              done()
            })
        })
    })

    it('it should update the type', (done) => {
      chai.request(url)
        .get(`type/${typeReference}`)
        .set('Cookie', loginCookie)
        .end(function (_err, res) {
          let typeData = res.body.type
          typeData.name = 'Desktop'
          chai.request(url)
            .post('type/update')
            .set('Cookie', loginCookie)
            .send(typeData)
            .end(function (_err, res) {
              chai.expect(res.body).to.be.a('object')
              chai.expect(res.body).to.have.property('code').to.equal(200)
              chai.expect(res.body.message).equal('Exito')
              chai.expect(res.body.description).equal('Tipo actualizado correctamente')
              chai.expect(res.body).to.have.property('tipo').to.be.a('object')
              done()
            })
        })
    })
  })

  describe('/GET type', () => {
    it('it should not be authorize to get the type', (done) => {
      chai.request(url)
        .get(`type/${typeReference}`)
        .end(function (_err, res) {
          chai.expect(res.error).to.have.status(401)
          chai.expect(res.error).to.have.property('text').to.equal('Not authorized request!')
          done()
        })
    })

    it('it should not found and get the type', (done) => {
      chai.request(url)
        .get('type/00000000')
        .set('Cookie', loginCookie)
        .end(function (_err, res) {
          chai.expect(res.body).to.be.a('object')
          chai.expect(res.body).to.have.property('code').to.equal(404)
          chai.expect(res.body.message).equal('Ocurrio un error')
          chai.expect(res.body.description).equal('Tipo no encontrado')
          done()
        })
    })

    it('it should get the type', (done) => {
      chai.request(url)
        .get(`type/${typeReference}`)
        .set('Cookie', loginCookie)
        .end(function (_err, res) {
          chai.expect(res.body).to.be.a('object')
          chai.expect(res.body).to.have.property('code').to.equal(200)
          chai.expect(res.body.message).equal('Exito')
          chai.expect(res.body.description).equal('Tipo encontrado con exito')
          chai.expect(res.body).to.have.property('type').to.be.a('object')
          done()
        })
    })

    it('it should get all versions', (done) => {
      chai.request(url)
        .get('type/all/types')
        .set('Cookie', loginCookie)
        .end(function (_err, res) {
          chai.expect(res.body).to.be.a('object')
          chai.expect(res.body).to.have.property('code').to.equal(200)
          chai.expect(res.body.message).equal('Exito')
          chai.expect(res.body.description).equal('Tipos encontrados con exito')
          chai.expect(res.body).to.have.property('types').to.be.a('array')
          done()
        })
    })
  })

  describe('/REMOVE type', () => {
    it('it should not be authorize to remove the type', (done) => {
      chai.request(url)
        .delete('application/remove')
        .send({ id: typeReference })
        .end(function (_err, res) {
          chai.expect(res.error).to.have.status(401)
          chai.expect(res.error).to.have.property('text').to.equal('Not authorized request!')
          done()
        })
    })

    it('it should remove the type', (done) => {
      chai.request(url)
        .delete('type/remove')
        .set('Cookie', loginCookie)
        .send({ id: typeReference })
        .end(function (_err, res) {
          chai.expect(res.body).to.be.a('object')
          chai.expect(res.body).to.have.property('code').to.equal(200)
          chai.expect(res.body.message).equal('Exito')
          chai.expect(res.body.description).equal('Tipo removido con exito')
          done()
        })
    })
  })
})
