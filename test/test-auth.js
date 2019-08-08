'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { User } = require('../users/models');

const { app, runServer, closeServer } = require('../server');
const { seedBrewData, tearDownDb } = require('./seedDatabase');
const { DATABASE_URL } = require('../config');
const { JWT_SECRET } = require('../config');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(expect);

describe('Auth endpoints', function() {
    const username = 'exampleUser';
    const password = 'examplePass';
    const firstName = 'Example';
    const lastName = 'User';

    before(function() {
        return runServer(DATABASE_URL);
    });

    beforeEach(function() {
        return User.hashPassword(password).then(password => 
            User.create({
                username,
                password,
                firstName,
                lastName
            })
        );
    });

    afterEach(function() {
        return User.deleteOne({});
    });

    after(function() {
        return closeServer();
    });

    describe('auth login', function() {
        it('Should reject requests with no credentials', function() {
            return chai
                .request(app)
                .post('/auth/login')
                .then(function(res) {
                    expect(res).to.have.status(400);
                })
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }
                });
        });
        it('Should reject requests with incorrect usernames', function() {
            return chai
                 .request(app)
                 .post('/auth/login')
                 .send({ username: 'WrongUsername', password })
                 .then(function(res) {
                     expect(res).to.have.status(401);
                 })
                 .catch(err => {
                     if (err instanceof chai.AssertionError) {
                         throw err;
                     }
                 });
         });
         it('Should reject requests with incorrect passwords', function() {
             return chai
                 .request(app)
                 .post('/auth/login')
                 .send({ username, password: 'WrongPassword' })
                 .then(function(res) {
                    expect(res).to.have.status(401);
                 })
                 .catch(err => {
                     if (err instanceof chai.AssertionError) {
                         throw err;
                     }
                 });
         });
         it('Should return a valid auth token', function() {
             return chai
                 .request(app)
                 .post('/auth/login')
                 .send({ username, password, firstName, lastName })
                 .then(res => {
                     expect(res.body).to.be.an('object');
                     const token = res.body.authToken;
                     expect(token).to.be.a('string');
                     const payload = jwt.verify(token, JWT_SECRET, {
                         algorithm: ['HS256']
                     });
                     console.log(payload);
                     expect(payload.user.username).to.deep.equal(username);
                 });
         });
    });
    
    

})