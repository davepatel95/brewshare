'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const { Brew } = require('../brews/models');
const { User } = require('../users/models');

const createAuthToken = require('../auth/router');
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

    describe('GET endpoint', function() {
        it('should return all brew reviews', function() {
            let res;
            return chai
                .request(app)
                .get('/brews')
                .then(function(_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.brews).to.have.length.of.at.least(1);
                    return Brew.countDocuments();  
                })
                .then(function(countDocuments) {
                    console.log(countDocuments);
                    expect(res.body.brews).to.have.lengthOf(countDocuments);
                });
        });
        it('Should retrieve reflection by id', function() {
            let resBrew;
            return chai.request(app)
                .get('/brews')
                .then(function(res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.brews).to.be.a('array');
                    expect(res.body.brews).to.have.length.of.at.least(1);
                    res.body.brews.forEach(function(brew) {
                        expect(brew).to.be.a('object');
                        expect(brew).to.include.keys('id', 'author', 'title', 'roasters', 'beansOrigin', 'flavorNotes', 'brewMethod', 'description');
                    });
                    resBrew = res.body.brews[0];
                    return Brew.findById(resBrew.id);
                })
                .then(function(brew) {
                    expect(resBrew.title).to.equal(brew.title);
                    expect(resBrew.author).to.equal(brew.author);
                });
        });
    });

    describe('POST endpoint', function() {
        it('should add new brew review', function() {
            const newBrew = generateBrewData();
            return chai.request(app)
                .post('/brews')
                .send(newBrew)
                .then(function(res) {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.include.keys('id', 'title', 'author', 'roasters', 'beansOrigin', 'flavorNotes', 'brewMethod', 'description');
                    expect(res.body.author).to.equal(newBrew.author);
                    expect(res.body.title).to.equal(newBrew.title);
                    expect(res.body.roasters).to.equal(newBrew.roasters);
                    return Brew.findById(res.body.id);
                })
                .then(function(brew) {
                    expect(brew.title).to.equal(newBrew.title);
                    expect(brew.author).to.equal(newBrew.author);
                });
        });
    });

    describe('PUT endpoint', function() {
        it('should update fields sent over by user', function() {
            const updateData = {
                title: 'Boing Boing from GGET',
                description: 'it is list fam'
            };
            return Brew
                .findOne()
                .then(function(brew) {
                    updateData.id = brew.id;

                    return chai.request(app)
                        .put(`/brews/${brew.id}`)
                        .send(updateData);
                })
                .then(function(res) {
                    expect(res).to.have.status(200);
                    return Brew.findByIdAndUpdate(updateData.id);
                })
                .then(function(brew) {
                    expect(brew.title).to.equal(updateData.title);
                    expect(brew.description).to.equal(updateData.description);
                });
        });
    });

    describe('DELETE endpoint', function() {
        it('should delete brew review by id', function() {
           let brew;
           return Brew
                .findOne()
                .then(function(_brew) {
                    brew = _brew;
                    return chai
                        .request(app)
                        .delete(`/brews/${brew.id}`);
                })
                .then(function(res) {
                    expect(res).to.have.status(204);
                    return Brew.findById(brew.id);
                })
                .then(function(res) {
                    console.log(res);
                });
        });
    });
});