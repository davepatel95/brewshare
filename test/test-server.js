'use strict';

const chai = require("chai");
const chaiHttp = require("chai-http");
const {app, runServer, closeServer } = require("../server");

const expect = chai.expect;
chai.use(chaiHttp);

describe('index page', function() {
    it("should send html for landing page", function() {
        return chai
            .request(app)
            .get("/index.html")
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            });
    });
});

describe('create page', function() {
    it("should send html for create brew page", function() {
        return chai
            .request(app)
            .get("/create.html")
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