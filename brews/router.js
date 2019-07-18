'use strict';


const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const passport = require('passport');
mongoose.Promise = global.Promise;

const { jwtStrategy } = require('../auth/strategies');
const {Brew} = require('./models');

passport.use(jwtStrategy);
const jwtAuth = passport.authenticate('jwt', { session: false });

router.get('/', jwtAuth, (req, res) => {
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

router.post('/', (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }

    Brew
        .create({
            title: req.body.title,
            roasters: req.body.roasters,
            beansOrigin: req.body.beansOrigin,
            flavorNotes: req.body.flavorNotes,
            brewMethod: req.body.brewMethod,
            description: req.body.description
        })
        .then()
})
// router.post('/', async (req, res) => {
//     const brew = new Brew(req.body);
//     try {
//         await brew.save();
//         res.status(201).json(brew);
//     } catch(err) {
//         res.status(500).json({message: 'Internal server error'});
//     }

// })

module.exports = router;