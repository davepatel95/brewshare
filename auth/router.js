'use strict';

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const config = require('../config');
const router = express.Router();

const createAuthToken = function(user) {
    return jwt.sign({user}, config.JWT_SECRET, {
        subject: user.username,
        expiresIn: config.JWT_EXPIRY,
        algorithm: 'HS256'
    });
};

const localAuth = passport.authenticate('local', { session: false });
router.use(bodyParser.json());

router.post('/login', localAuth, (req, res) => {
    const authToken = createAuthToken(req.user.serialize());
    res.json({ authToken });
});

const jwtAuth = passport.authenticate('jwt', { session: false });

router.get('/logout', function(req, res) {
    res.redirect('/');
    alert('logging out');
});

module.exports =  router, createAuthToken;