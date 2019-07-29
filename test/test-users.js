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
    const usernameB = 'exampleUserB'
    const passwordB = 'examplePassB';
    const firstNameB = 'ExampleB';
    const lastNameB = 'UserB';

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

        });
    });
});