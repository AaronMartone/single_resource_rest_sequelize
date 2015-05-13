'use strict';

var chai = require('chai');
var chaiHTTP = require('chai-http');
var mocha = require('mocha');

var expect = chai.expect;

chai.use(chaiHTTP);

var app = 'http://localhost:3000';
var tmpID;

describe('Sequelize-Based Single-Resource API...', function() {

    it('Should generate JSON for calls to: GET /users', function(done) {
        chai.request(app)
            .get('/users')
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res).to.be.json;
                expect(res).to.have.status(200);                
                done();
            });        
    });

    it('Should generate JSON for calls to: GET /users/<id>', function(done) {
        chai.request(app)
            .get('/users/1')
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res).to.be.json;
                expect(res).to.have.status(200);                
                done();
            });
    });

    it('Should generate JSON for calls to: POST /users', function(done) {
        chai.request(app)
            .post('/users')
            .send({ name: 'Test User', gender: 'Male', age: 0 })
            .end(function(err, res) {
                tmpID = res.body.id;
                expect(err).to.eql(null);
                expect(res).to.be.json;
                expect(res).to.have.status(200);  
                expect(res.body.msg).to.eql('success');              
                done();
            });
    });

    it('Should generate JSON for calls to: PUT /users', function(done) {
        chai.request(app)
            .put('/users/' + tmpID)
            .send({ name: 'New Test User', gender: 'Female', age: 20 })
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res).to.be.json;
                expect(res).to.have.status(200);  
                expect(res.body.msg).to.eql('success');              
                done();
            });
    });

    it('Should generate JSON for calls to: DELETE /users', function(done) {
        chai.request(app)
            .delete('/users/' + tmpID)
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res).to.be.json;
                expect(res).to.have.status(200);  
                expect(res.body.msg).to.eql('success');              
                done();
            });
    });            

});