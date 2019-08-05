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

// GET requests to /brews
router.get('/', (req, res) => {
     Brew
        .find()
        .then(brews => {
            res.json({
                brews: brews.map(
                    (brew => brew.serialize()))
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
});

router.get('/:id', (req, res) => {
    Brew
        .findById(req.params.id)
        .then(brew => res.json(brew))
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal Server Error'});
        });
});

// POST requests to /brews
router.post('/', (req, res) => {
    const requiredFields = ['title', 'author', 'roasters', 'beansOrigin', 'flavorNotes', 'brewMethod', 'description'];
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
            author: req.body.author,
            roasters: req.body.roasters,
            beansOrigin: req.body.beansOrigin,
            flavorNotes: req.body.flavorNotes,
            brewMethod: req.body.brewMethod,
            description: req.body.description
        })
        .then(brew => res.status(201).json(brew.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal Server Error'});
        });
});

// PUT requests by id
router.put('/brews/:id', (req, res) => {
    Brew
        .findByIdAndUpdate(
            req.params.id,
            req.body,
            // asks mongoose to return updated version of document instead pre-updated one
            {new: true},
            (err, brew) => {
                if (err) return res.status(500).send(err);
                return res.send(brew);
            }
        )
});


// DELETE request by id
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