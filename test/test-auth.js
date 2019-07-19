'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const { User } = require('../users/models');

const { app, runServer, closeServer } = require('../server');
const { seedBrewData, tearDownDb } = require('./seedDatabase');
const { TEST_DATABASE_URL } = require('../config');
const { expect } = chai;

chai.use(chaiHttp);

describe('Auth', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return seedBrewData();
    });

    afterEach(function() {
        return tearDownDb();
    });

    after(function() {
        return closeServer();
    });

    

})