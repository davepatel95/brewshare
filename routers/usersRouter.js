'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const { User } = require('../models/users');

router.post('/', (req, res) => {
    const requiredFields = ['firstName', 'lastName', 'password', 'email'];
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
    
    const stringFields = ['FirstName', 'lastName', 'password', 'email'];
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

    const explicitlyTrimmedFields = ['email', 'password'];
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

    const fieldSizes = {
        firstName: {
            min: 1
        },
        lastName: {
            min: 1
        },
        email: {
            min: 5
        },
        password: {
            min: 8,
            max: 56
        }
    };
    
    //
    const fieldTooSmall = Object.keys(fieldSizes).find(
        field => 'min' in fieldSizes[field] && req.body[field].trim().length < fieldSizes[field].min
    );

    const fieldTooLarge = Object.keys(fieldSizes).find(
        field => 'max' in fieldSizes[field] && req.body[field].trim().length < fieldSizes[field].max
    );

    if(fieldTooSmall || fieldTooLarge) {
        console.log('Field too small or too large');
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: fieldTooSmall
            ? `${fieldTooSmall} must be at least ${fieldSizes[fieldTooSmall].min} characters long`
            : `${fieldTooLarge} must be at most ${fieldSizes[fieldTooLarge].max} characters long`,
            location: fieldTooSmall || fieldTooLarge
        });
    }

    let { email, password, firstName, lastName } = req.body;
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.toLowerCase();

    return User.find({ email: email })
        .countDocuments()
        .then(count => {
            if (count > 0) {
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Email already associated with another account',
                    location: 'email'
                });
            }
            return User.hashPassword(password);
        })
        .then(hash => {
            return User.creat({
                email,
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

module.exports =  router;