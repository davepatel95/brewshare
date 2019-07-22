'use strict';

const chai = require("chai");
const chaiHttp = require("chai-http");
const {app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL } = require('../config');
const { seedDatabase, tearDownDb } = require('./seedDatabase');

const expect = chai.expect;
chai.use(chaiHttp);


describe('Server', function() {
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

    describe('index page', function() {
        it("should send html for landing page", function() {
            return chai
                .request(app)
                .get('/')
                .then(function(res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.html;
                });
        });
    });
});











describe('create page', function() {
    it("should send html for create brew page", function() {
        return chai
            .request(app)
            .get('/')
            .then(function(res) {
                expect(res).to.have.status(200);
            });
    });
});

describe('login page', function() {
    it("should send html for login page", function() {
        return chai
            .request(app)
            .get("/login.html")
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            });
    });
})