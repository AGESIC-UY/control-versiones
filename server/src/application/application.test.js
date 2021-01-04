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
  name: 'Application test',
  description: 'Just a test application description'
}

let loginCookie
let appReference
let versionReference

describe('Application', () => {
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

  describe('/POST application', () => {
    it('it should not be authorize to create the application', (done) => {
      chai.request(url)
        .post('application/create')
        .send(app)
        .end((_err, res) => {
          chai.expect(res.error).to.have.status(401)
          chai.expect(res.error).to.have.property('text').to.equal('Not authorized request!')
          done()
        })
    }).timeout(5000)

    it('it should create the application', (done) => {
      chai.request(url)
        .post('application/create')
        .set('Cookie', loginCookie)
        .send(app)
        .end((_err, res) => {
          chai.expect(res).to.have.status(200)
          chai.expect(res.body.message).equal('Exito')
          chai.expect(res.body).to.be.a('object')
          chai.expect(res.body).to.have.property('application').to.be.a('string')
          done()
        })
    }).timeout(5000)

    it('it should not create the same application', (done) => {
      chai.request(url)
        .post('application/create')
        .set('Cookie', loginCookie)
        .send(app)
        .end((_err, res) => {
          chai.expect(res.body).to.be.a('object')
          chai.expect(res.body).to.have.property('code').to.equal(422)
          chai.expect(res.body.message).equal('Ocurrió un error')
          chai.expect(res.body.description).equal('El nombre ya ha sido registrado')
          done()
        })
    }).timeout(5000)
  })

  describe('/UPDATE application', () => {
    it('it should not be authorize to update the application', (done) => {
      chai.request(url)
        .get(`application/${app.name}`)
        .set('Cookie', loginCookie)
        .end(function (_err, res) {
          appReference = res.body.application
          appReference.description = 'first update for application test'
          chai.request(url)
            .post('application/update')
            .send(appReference)
            .end(function (_err, res) {
              chai.expect(res.error).to.have.status(401)
              chai.expect(res.error).to.have.property('text').to.equal('Not authorized request!')
              done()
            })
        })
    })

    it('it should update the application', (done) => {
      chai.request(url)
        .get(`application/${app.name}`)
        .set('Cookie', loginCookie)
        .end(function (_err, res) {
          appReference = res.body.application
          appReference.description = 'first update for application test'

          chai.request(url)
            .post('application/update')
            .set('Cookie', loginCookie)
            .send(appReference)
            .end(function (_err, res) {
              chai.expect(res.body).to.be.a('object')
              chai.expect(res.body).to.have.property('code').to.equal(200)
              chai.expect(res.body.message).equal('Exito')
              chai.expect(res.body.description).equal('Aplicacion actualizada correctamente')
              chai.expect(res.body).to.have.property('application').to.be.a('object')
              done()
            })
        })
    })
  })

  describe('/GET from mobile', () => {
    it('it should return invalid key for application from mobile', (done) => {
      chai.request(url)
        .get(`application/mobile/app?name=${appReference.name}&clientKey=111&version=1.0.0`)
        .set('Cookie', loginCookie)
        .end(function (_err, res) {
          chai.expect(res.body).to.be.a('object')
          chai.expect(res.body).to.have.property('code').to.equal(400)
          chai.expect(res.body.message).equal('Ocurrio un error')
          chai.expect(res.body.description).equal('Client key invalido')
          done()
        })
    })

    it('it should get application but no versions from mobile', (done) => {
      chai.request(url)
        .get(`application/mobile/app?name=${appReference.name}&clientKey=${appReference.clientKey}&version=1.0.0`)
        .set('Cookie', loginCookie)
        .end(function (_err, res) {
          chai.expect(res.body).to.be.a('object')
          chai.expect(res.body).to.have.property('code').to.equal(404)
          chai.expect(res.body.message).equal('Ocurrio un error')
          chai.expect(res.body.description).equal('No se encontro ninguna version registrada')
          chai.expect(res.body).to.have.property('app').to.be.a('object')
          done()
        })
    })

    it('it should get application but the last version from mobile', (done) => {
      const version = { version: '1.0.0', servicesUrls: ['https://www.gub.uy/'], minVersion: '1.0.0', owner: appReference }
      chai.request(url)
        .post('version/create')
        .set('Cookie', loginCookie)
        .send(version)
        .end((_err, res) => {
          versionReference = res.body.version
          chai.expect(res.body).to.have.property('code').to.equal(200)
          chai.expect(res.body.message).equal('Exito')
          chai.expect(res.body.description).equal('Version creada correctamente')
          chai.expect(res.body).to.have.property('version').to.be.a('string')

          chai.request(url)
            .get(`application/mobile/app?name=${appReference.name}&clientKey=${appReference.clientKey}&version=2.0.0`)
            .set('Cookie', loginCookie)
            .end(function (_err, res) {
              chai.expect(res.body).to.be.a('object')
              chai.expect(res.body).to.have.property('code').to.equal(200)
              chai.expect(res.body.message).equal('Exito')
              chai.expect(res.body.description).equal('No se encontro version, se proporciona los datos de la última version registrada')
              chai.expect(res.body).to.have.property('app').to.be.a('object')
              done()
            })
        })
    })

    it('it should get application but the correct version from mobile', (done) => {
      chai.request(url)
        .get(`application/mobile/app?name=${appReference.name}&clientKey=${appReference.clientKey}&version=1.0.0`)
        .set('Cookie', loginCookie)
        .end(function (_err, res) {
          chai.expect(res.body).to.be.a('object')
          chai.expect(res.body).to.have.property('code').to.equal(200)
          chai.expect(res.body.message).equal('Exito')
          chai.expect(res.body.description).equal('Version encontrada')
          chai.expect(res.body).to.have.property('app').to.be.a('object')
          done()
        })
    })
  })

  describe('/GET application', () => {
    it('it should not be authorize to get the application', (done) => {
      chai.request(url)
        .get(`application/${app.name}`)
        .end(function (_err, res) {
          chai.expect(res.error).to.have.status(401)
          chai.expect(res.error).to.have.property('text').to.equal('Not authorized request!')
          done()
        })
    })

    it('it should not found and get the type', (done) => {
      chai.request(url)
        .get('application/00000000')
        .set('Cookie', loginCookie)
        .end(function (_err, res) {
          chai.expect(res.body).to.be.a('object')
          chai.expect(res.body).to.have.property('code').to.equal(404)
          chai.expect(res.body.message).equal('Ocurrio un error')
          chai.expect(res.body.description).equal('Aplicacion no encontrada')
          done()
        })
    })

    it('it should get the application', (done) => {
      chai.request(url)
        .get(`application/${app.name}`)
        .set('Cookie', loginCookie)
        .end(function (_err, res) {
          chai.expect(res.body).to.be.a('object')
          chai.expect(res.body).to.have.property('code').to.equal(200)
          chai.expect(res.body.message).equal('Exito')
          chai.expect(res.body.description).equal('Aplicacion encontrada con exito')
          chai.expect(res.body).to.have.property('application').to.be.a('object')
          done()
        })
    })

    it('it should get all application', (done) => {
      chai.request(url)
        .get('application/all/applications')
        .set('Cookie', loginCookie)
        .end(function (_err, res) {
          chai.expect(res.body).to.be.a('object')
          chai.expect(res.body).to.have.property('code').to.equal(200)
          chai.expect(res.body.message).equal('Exito')
          chai.expect(res.body.description).equal('Aplicaciones encontradas con exito')
          chai.expect(res.body).to.have.property('applications').to.be.a('array')
          done()
        })
    })

    it('it should return invalid name for application from mobile', (done) => {
      chai.request(url)
        .get(`application/mobile/app?name=invalidName&clientKey=${appReference.clientKey}&version=1.0.0`)
        .set('Cookie', loginCookie)
        .end(function (_err, res) {
          chai.expect(res.body).to.be.a('object')
          chai.expect(res.body).to.have.property('code').to.equal(400)
          chai.expect(res.body.message).equal('Ocurrio un error')
          chai.expect(res.body.description).equal('Nombre de aplicacion invalido')
          done()
        })
    })
  })

  describe('/REMOVE application', () => {
    it('it should not be authorize to remove the application', (done) => {
      chai.request(url)
        .delete('application/remove')
        .send({ id: appReference._id })
        .end(function (_err, res) {
          chai.expect(res.error).to.have.status(401)
          chai.expect(res.error).to.have.property('text').to.equal('Not authorized request!')
          done()
        })
    })

    it('it should remove the application', (done) => {
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
            .send({ id: appReference._id })
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
