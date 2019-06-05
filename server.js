'use strict';

const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

const {DATATBASE_URL, PORT} = require('./config');

// const {Router}
// const {Router}
// const {Router}
const bodyParser = require('body-parser');

const app = express();
const {coffeeReviewsRouter} = require('./routers/reviewsRouter');

app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.urlencoded({ extended: false }))

// parses application/json
app. use(bodyParser.json());

//CORS
app.use(cors());

app.use(passport.initialize());
passport.use('local', basicStrategy);
passport.use(jwtStrategy);

app.use('*', (req, res) => {
    return res.status(404).json({message: 'Not Found'});
})

mongoose.Promise = global.Promise;

let server;

function runServer(databaseUrl = DATATBASE_URL, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, ()=> {
                console.log('Your app is listening on port ${port}');
                resolve();
            })
            .on('error', err => {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer().catch(err => console.error(err));
}

module.exports = {runServer, app, closeServer};