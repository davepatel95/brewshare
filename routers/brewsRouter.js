'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
// const passport = require('passport');
mongoose.Promise = global.Promise;


const {Brew} = require('../models/brews');


router.get('/', (req, res) => {
     Brew
        .find()
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

router.post('/', async (req, res) => {
    const brew = new Brew(req.body);
    try {
        await brew.save();
        res.status(201).json(brew);
    } catch(err) {
        res.status(500).json({message: 'Internal server error'});
    }

})

module.exports = router;