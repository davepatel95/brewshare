'use strict';

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server.js");

const expect = chai.expect;
chai.use(chaiHttp);

describe('index page', function() {
    it("should exist", function() {
        return chai
            .request(app)
            .get("/index.html")
            .then(function(res) {
                expect(res).to.have.status(200);
            });
    });
});

describe('create page', function() {
    it("should exist", function() {
        return chai
            .request(app)
            .get("/create.html")
            .then(function(res) {
                expect(res).to.have.status(200);
            });
    });
});

describe('css page', function() {
    it("should exist", function() {
        return chai
            .request(app)
            .get("/index.css")
            .then(function(res) {
                expect(res).to.have.status(200);
            });
    });
});

describe('index js page', function() {
    it("should exist", function() {
        return chai
            .request(app)
            .get("/index.js")
            .then(function(res) {
                expect(res).to.have.status(200);
            });
    });
});

describe('review page', function() {
    it("should exist", function() {
        return chai
            .request(app)
            .get("/review.html")
            .then(function(res) {
                expect(res).to.have.status(200);
            });
    });
});