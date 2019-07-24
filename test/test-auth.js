'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { User } = require('../users/models');

const { app, runServer, closeServer } = require('../server');
const { seedBrewData, tearDownDb } = require('./seedDatabase');
const { TEST_DATABASE_URL } = require('../config');
const { JWT_SECRET } = require('../config');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(expect);

describe('Auth endpoints', function() {
    const username = 'exampleUser';
    const password = 'examplepassword';
    const firstName = 'Example';
    const lastName = 'User';

    before(function() {
        return runServer(TEST_DATABASE_URL);
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
                .post('/login')
                .then(() => expect.fail(null, null, 'Request should not succeed'))
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(400);
                });
        });
        it('Should reject requests with incorrect usernames', function() {
            return chai
                .request(app)
                .post('/login')
                .send({ username: 'WrongUsername', password })
                .then(() => 
                    expect.fail(null, null, 'Request should not succeed')
                )
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                });
        });
        it('Should reject requests with incorrect passwords', function() {
            return chai
                .request(app)
                .post('/login')
                .send({ username, password: 'WrongPassword' })
                .then(() => expect.fail(null, null, 'Request should not succeed'))
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(401);
                });
        });
        it('Should return a valid auth token', function() {
            return chai
                .request(app)
                .post('/login')
                .send({ username, password })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    const token = res.body.authToken;
                    expect(token).to.be.a('string');
                    const payload = jwt.verify(token, JWT_SECRET, {
                        algorithm: ['HS256']
                    });
                    expect(payload.user.username).to.deep.equal(username);
                });
        });
    });
    
    

})