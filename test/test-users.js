'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../users/models');
const { DATABASE_URL } = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('/user', function() {
    const username = 'exampleUser';
    const password = 'examplePass';
    const firstName = 'Example';
    const lastName = 'User';

    before(function() {
        return runServer(DATABASE_URL);
    });

    after(function () {
        return closeServer();
    });

    beforeEach(function () {
    });

    afterEach( function() {
        return User.deleteOne({});
    });

    describe('/users', function() {
        describe('POST', function() {
            it('Should reject users with missing username', function() {
                return chai
                    .request(app)
                    .post('/users')
                    .send({
                        password,
                        firstName,
                        lastName
                    })
                    .then(function(res) {
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('missing field');
                        expect(res.body.location).to.equal('username');
                    })
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }
                    });
            });
            it('Should reject users with missing password', function() {
                return chai
                    .request(app)
                    .post('/users')
                    .send({
                        username,
                        firstName,
                        lastName
                    })
                    .then(function(res) {
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('missing field');
                        expect(res.body.location).to.equal('password');
                    })
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }
                    });
            });
            it('Should reject users with a non-string username', function() {
                return chai
                    .request(app)
                    .post('/users')
                    .send({
                        username: 1234,
                        password,
                        firstName,
                        lastName
                    })
                    .then(function(res) {
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('Incorrect field type: expected string');
                        expect(res.body.location).to.equal('username');
                    })
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }
                    });
            });
            it('Should reject users with non-string password', function() {
                return chai
                    .request(app)
                    .post('/users')
                    .send({
                        username,
                        password: 1234,
                        firstName,
                        lastName
                    })
                    .then(function(res) {
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('Incorrect field type: expected string');
                        expect(res.body.location).to.equal('password');
                    })
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }
                    });
            });
            it('Should reject users with non-string first name', function() {
                return chai
                    .request(app)
                    .post('/users')
                    .send({
                        username,
                        password,
                        firstName: 1234,
                        lastName
                    })
                    .then(function(res) {
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('Incorrect field type: expected string');
                        expect(res.body.location).to.equal('firstName');
                    })
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }
                    });
            });
            it('Should reject users with non-string last name', function() {
                return chai
                    .request(app)
                    .post('/users')
                    .send({
                        username,
                        password,
                        firstName,
                        lastName: 1234
                    })
                    .then(function(res) {
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('Incorrect field type: expected string');
                        expect(res.body.location).to.equal('lastName');
                    })
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }
                    });
            });
            it('Should reject users with non-trimmed username', function() {
                return chai
                    .request(app)
                    .post('/users')
                    .send({
                        username: ` ${username} `,
                        password,
                        firstName,
                        lastName
                    })
                    .then(function(res) {
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('Cannot start or end with whitespace');
                        expect(res.body.location).to.equal('username');
                    })
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }
                    });
            });
            it('Should reject users with non-trimmed password', function() {
                return chai
                    .request(app)
                    .post('/users')
                    .send({
                        username,
                        password: ` ${password} `,
                        firstName,
                        lastName
                    })
                    .then(function(res) {
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('Cannot start or end with whitespace');
                        expect(res.body.location).to.equal('password');
                    })
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }
                    });
            });
            it('Should reject users with empty username', function() {
                return chai
                    .request(app)
                    .post('/users')
                    .send({
                        username: '',
                        password,
                        firstName,
                        lastName
                    })
                    .then(function(res) {
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('username must be at least 5 characters long')
                        expect(res.body.location).to.equal('username')
                    })
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }
                    });
            });
            it('Should reject users with password less than 8 characters', function() {
                return chai
                    .request(app)
                    .post('/users')
                    .send({
                        username,
                        password: '13fsd',
                        firstName,
                        lastName
                    })
                    .then(function(res) {
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('password must be at least 8 characters long')
                        expect(res.body.location).to.equal('password')
                    })
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }
                    });
            });
            it('Should reject users with password greater than 72 characters', function() {
                return chai
                    .request(app)
                    .post('/users')
                    .send({
                        username,
                        password: new Array(73).fill('a').join(''),
                        firstName,
                        lastName
                    })
                    .then(function(res) {
                        expect(res).to.have.status(422);
                        expect(res.body.reason).to.equal('ValidationError');
                        expect(res.body.message).to.equal('password must be at most 72 characters long')
                        expect(res.body.location).to.equal('password')
                    })
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }
                    });
            });
            it('Should reject users with duplicate username', function () {
                this.timeout(5000);
                return User.create({
                  username: 'janedoe',
                  password,
                  firstName,
                  lastName
                })
                  .then(() =>
                    chai.request(app).post('/users').send({
                      username: 'janedoe',
                      password,
                      firstName,
                      lastName
                    })
                  )
                  .then(function(res) {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal(
                      'username already associated with another account'
                    );
                    expect(res.body.location).to.equal('username');
                  })
                  .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }
                });
                  
              });
            it('Should create a new user', function() {
                this.timeout(5000);
                return chai
                    .request(app)
                    .post('/users')
                    .send({
                        username,
                        password,
                        firstName,
                        lastName
                    })
                    .then(function(res) {
                        expect(res).to.have.status(201);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.keys(
                            'username',
                            'firstName',
                            'lastName'
                        )
                        expect(res.body.username).to.equal(username);
                        expect(res.body.firstName).to.equal(firstName);
                        expect(res.body.lastName).to.equal(lastName);
                        return User.findOne({
                            username
                        });
                    })
                    .then(user => {
                        expect(user).to.not.be.null;
                        expect(user.firstName).to.equal(firstName);
                        expect(user.lastName).to.equal(lastName);
                    });
            });
        });
    });
});