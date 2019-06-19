'use strict';

const {router} = require('../routers/authRouter');
const { localStrategy, jwtStrategy } = require('./strategies');

module.exports = { router, localStrategy, jwtStrategy };