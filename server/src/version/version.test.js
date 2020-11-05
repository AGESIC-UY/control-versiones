// 'use strict'

// process.env.NODE_ENV = 'test'
// let chai = require('chai')
// const expect = chai.expect
// const version = require('./index')
// const VersionModel = require('./version.model')
// const AppModel = require('./../application/application.model')
// const TypeModel = require('./../type/type.model')
// const UserModel = require('./../user/user.model')
// let chaiHttp = require('chai-http')
// const { config } = require('../config')
// // let should = chai.should()
// const url = `http://${config.host}:${config.port}/api/`

// const userData = {
//   id: 'asdasdasdasd',
//   username: 'test1',
//   name: 'test1',
//   email: 'test@test.com',
//   salt: 'aaaaaaaaaaa',
//   password: 'bbbbbbbbbbb',
//   activation: 'cccccccccc'
// }

// chai.use(chaiHttp)

// describe('Version', () => {
//   let versions
//   let app
//   let type
//   let user
//   beforeEach((done) => {
//     user = new UserModel(userData)
//     user.save().then(() => console.log('user guardado'))
//     type = new TypeModel({
//       name: 'Desktop'
//     })

//     type.save().then(() => console.log('type guardado'))
//     versions = new VersionModel({
//       version: 'first',
//       servicesUrls: [],
//       minVersion: '1.1'
//     })

//     versions.save().then(() => console.log('version guardado'))

//     app = new AppModel({
//       identifier: 'test1',
//       name: 'test1',
//       description: 'test1',
//       type: type,
//       version: versions
//     })

//     app.save().then(() => console.log('app guardado'))

//     done()
//   })

//   it('should get version object', () => {
//     expect(version).to.be.an('object')
//   })

//   describe('/POST version', () => {
//     it('it should not POST a version', (done) => {
//       let version = {
//         version: '1',
//         servicesUrls: [],
//         minVersion: '1'
//       }
//       chai.request(url)
//         .post('version/create')
//         .send(version)
//         .end((_err, res) => {
//           res.should.have.status(401)
//           done()
//         })
//     })

//     it('it should POST a version ', (done) => {
//       let version = {
//         version: 'first',
//         servicesUrls: [],
//         minVersion: '1.1'
//       }

//       chai.request(url)
//         .post('version/create')
//         .auth('user', 'pass')
//         .send(version)
//         .end((_err, res) => {
//           // TODO arreglar test, este es un endpoint ptotegido, tiene que dar 200.
//           res.should.have.status(401)
//           // res.body.should.be.a('object');
//           // res.body.should.have.property('message').eql('Book successfully added!');
//           // res.body.book.should.have.property('title');
//           // res.body.book.should.have.property('author');
//           // res.body.book.should.have.property('pages');
//           // res.body.book.should.have.property('year');
//           done()
//         })
//     })
//   })

//   describe('/GET version', () => {
//     it('it should GET all version', (done) => {
//       chai.request(url)
//         .get('version/all')
//         .end((_err, res) => {
//           res.should.have.status(200)
//           // res.body.should.be.a('array')
//           // res.body.length.should.be.eql(0)
//           done()
//         })
//     })
//   })
// })
