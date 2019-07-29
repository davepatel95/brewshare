'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {User} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

//Registers new user
router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['username', 'password'];
    const missingField = requiredFields.find(field => !(field in req.body));

    if (missingField) {
        console.log('Missing Field');
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'missing field',
            location: missingField
        });
    }
    
    const stringFields = ['username', 'password', 'firstName', 'lastName' ];
    const nonStringField = stringFields.find(
        field => field in req.body && typeof req.body[field] !== 'string'
    );

    if(nonStringField) {
        console.log('nonStringField');
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Incorrect field type: expected string',
            location: nonStringField
        });
    }

    const explicitlyTrimmedFields = ['username', 'password'];
    const nonTrimmedField = explicitlyTrimmedFields.find(
        field => req.body[field].trim() !== req.body[field]
    );

    if(nonTrimmedField) {
        console.log('nonTrimmedField');
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Cannot start or end with whitespace',
            location: nonTrimmedField
        });
    }

    const sizedFields = {
        username: {
            min: 5
        },
        password: {
            min: 8,
            max: 72
        }
    };
    
    //
    const tooSmallField = Object.keys(sizedFields).find(
        field => 'min' in sizedFields[field] && req.body[field].trim().length < sizedFields[field].min
    );

    const tooLargeField = Object.keys(sizedFields).find(
        field => 'max' in sizedFields[field] && req.body[field].trim().length > sizedFields[field].max
    );

    if(tooSmallField || tooLargeField) {
        console.log('Field too small or too large');
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: tooSmallField
            ? `${tooSmallField} must be at least ${sizedFields[tooSmallField].min} characters long`
            : `${tooLargeField} must be at most ${sizedFields[tooLargeField].max} characters long`,
            location: tooSmallField || tooLargeField
        });
    }

    let { username, password, firstName = '', lastName = '' } = req.body;
    firstName = firstName.trim();
    lastName = lastName.trim();
    username = username.toLowerCase();

    return User.find({ username: username })
        .countDocuments()
        .then(count => {
            if (count > 0) {
                //rejects if username is already in use
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'username already associated with another account',
                    location: 'username'
                });
            }
            //otherwise, hashes password
            return User.hashPassword(password);
        })
        .then(hash => {
            return User.create({
                username,
                password: hash,
                firstName,
                lastName
            });
        })
        .then(user => {
            return res.status(201).json(user.serialize());
        })
        .catch(err => {
            if (err.reason === 'ValidationError') {
                return res.status(err.code).json(err);
            }
            res.status(500).json({ code: 500, message: 'Internal Server Error' });
        });
});

router.get('/', (req, res) => {
    return User.find()
        .then(users => res.json(users.map(user => user.serialize())))
        .catch(err => res.status(500).json({message: 'Internal server'}));
});

module.exports =  router;