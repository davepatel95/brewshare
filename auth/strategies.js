'use strict';


const { Strategy: LocalStrategy} = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { JWT_SECRET } = require('../config');
const { User } = require('../models/users');


require('dotenv').config();
const localStrategy = new LocalStrategy((username, password, callback) => {
    let user;
    User.findOne({ username: username })
        .then(_user => {
            user = _user;
            if(!user) {
                return Promise.reject({
                    reason: 'LoginError',
                    message: 'Incorrect username and password'
                });
            }
            return user.validatePassword(password);
        })
        .then(isValid => {
            if (!isValid) {
                return Promise.reject({
                    reason: 'LoginError',
                    message: 'Incorrect username or password'
                });
            }
            return callback(null, user);
        })
        .catch(err => {
            if (err.reason === 'LoginError') {
                return callback(null, false, err);
            }
            return callback(err, false);
        });
});

console.log(JWT_SECRET);
const jwtStrategy = new JwtStrategy(
    {
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
        algorithms: ['HS256']
    },
    (payload, done) => {
        done(null, payload.user);
    }
);

module.exports = { localStrategy, jwtStrategy };

