'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const { Brew } = require('../brews/models');
const { User } = require('../users/models');

const { createAuthToken } = require('../auth/router');
const { runServer, app, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const { 
    seedDatabase,
    tearDownDb,
    generateBrewData,
    generateFlavorNotes,
    preAuthUser
} = require('./seedDatabase');
const { expect } = chai;

const faker = require('faker');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const username = 'hpotter';
const firstName = 'Harry';
const lastName = 'Potter';
const {JWT_SECRET}  = require('../config');
const token = jwt.sign(
    {
        user: {
            username,
            firstName,
            lastName
        }
    },
    JWT_SECRET,
    {
        algorithm: 'HS256',
        subject: username,
        expiresIn: '24h'
    }
);
const decoded = jwt.decode(token);

const { seed}

chai.use(chaiHttp);

describe('/brews', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return seedDatabase();
    });

    afterEach(function() {
        return tearDownDb();
    });

    after(function() {
        return closeServer();
    });

    describe('GET all endpoint', function() {
        it('should return all brew reviews', function() {
            let res;
            return chai
                .request(app)
                .get('/brews')
                .then(function(_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    expect(res).to.be.json();
                    return Brew.count();
                })
                .then(function(count) {
                    expect(res.body).to.have.lengthOf(count);
                });
        });
    });
});