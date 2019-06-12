'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const passport = require('passport');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Brew} = require('../models/brews');

router.get('/', (req, res) => {
    Brew
        .find()
        .limit(15)
        .then(brews => {
            res.json({
                brews: brews.map(
                    (brew) => brew.serialize())
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
});