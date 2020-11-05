'use strict'
// process.env.NODE_ENV = 'test'

let chai = require('chai')
let chaiHttp = require('chai-http')
const { config } = require('../config')
chai.use(chaiHttp)
const url = `http://${config.host}:${config.port}/api/`
const md5 = require('md5')
const VersionModel = require('../version/version.model')
describe('Application', () => {
  let newTypeId
  let newApplicationId
  let versions
  beforeEach(() => {
    versions = new VersionModel({
      version: 'first',
      servicesUrls: [],
      minVersion: '1.1'
    })
    versions.save().then(() => console.debug('version guardado'))
  })

  describe('/POST type', () => {
    it('it should create the type application', (done) => {
      const type = { name: 'mobile' }
      chai.request(url)
        .post('type/create')
        .send(type)
        .end((_err, res) => {
          chai.expect(res).to.have.status(200)
          newTypeId = res.body.typeId
          done()
        })
    }).timeout(5000)
  })

  describe('/POST application', () => {
    it('it should create the application', (done) => {
      const app = {name: 'app no.1',
        type: newTypeId,
        description: 'this is the app no. 1',
        version: versions,
        identifier: md5('app no.1' + newTypeId + versions) }
      chai.request(url)
        .post('application/create')
        .send(app)
        .end((_err, res) => {
          chai.expect(res).to.have.status(200)
          chai.expect(res.body.success).equal(true)
          res.body.should.be.a('object')
          res.body.should.have.property('type').eql('applicationCreated')
          newApplicationId = res.body.application
          done()
        })
    }).timeout(5000)
  })

  describe('/POST application', () => {
    it('it should update the application', (done) => {
      chai.request(url)
        .post('application/update')
        .send({ _id: newApplicationId, name: 'app no.1 updated', type: newTypeId, description: 'this is the app no. 1 updated', version: versions, identifier: md5('app no.1' + newTypeId + versions) })
        .end(function (_err, res) {
          chai.expect(res).to.have.status(200)
          chai.expect(res.body.success).equal(true)
          res.body.should.be.a('object')
          res.body.should.have.property('type').eql('aplicationUpdate')
          done()
        })
    })
  })

  describe('/GET application', () => {
    it('it should get the application', (done) => {
      chai.request(url)
        .get(`application/${newTypeId}`)
        .end(function (_err, res) {
          chai.expect(res).to.have.status(200)
          done()
        })
    })
  })

  /*
  * Test the /GET route
  */
  describe('/GET all applications', () => {
    it('it should GET all the applications', (done) => {
      chai.request(url)
        .get('application/all/applications')
        .end(function (_err, res) {
          chai.expect(res).to.have.status(200)
          chai.expect(res.body.applications).to.be.a('array')
          chai.expect(res.body.applications.length).to.be.greaterThan(0)
          done()
        })
    })
  })
  describe('/POST application', () => {
    it('it should remove the application', (done) => {
      chai.request(url)
        .delete('application/remove')
        .send({ id: newApplicationId })
        .end(function (_err, res) {
          chai.expect(res).to.have.status(200)
          chai.expect(res.body.success).equal(true)
          res.body.should.be.a('object')
          res.body.should.have.property('type').eql('applicationRemove')
          done()
        })
    })
  })
})
