'use strict';
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

mongoose.Promise = global.Promise;
const { PORT, DATABASE_URL } = require('./config');
const { JWT_SECRET } = require('./config');
const app = express();

const brewsRouter  = require('./brews/router');
const authRouter = require('./auth/router');
const userRouter = require('./users/router');
const { localStrategy, jwtStrategy } = require('./auth/strategies');

app.use(express.json());
app.use(morgan('common'));
app.use(express.static('public'));
app.use('/brews', brewsRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('*', (req, res) => {
    return res.status(404).json({ message: "Not Found" });
});

let server;
function runServer(databaseUrl, port = PORT,) {
    return new Promise((resolve, reject) => {
        mongoose.set('useCreateIndex', true);
        mongoose.set('useFindAndModify', false);
        mongoose.connect(databaseUrl, { useNewUrlParser: true}, 
            err => {
                if (err) {
                    return reject(err);
                }
                server = app
                    .listen(port, () => {
                        console.log(`Your app is listening on port ${port}`);
                        resolve();
                    })
                    .on("error", err => {
                        mongoose.disconnect();
                        reject(err);
                    });
            }
        );
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log("Closing server");
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
    runServer(DATABASE_URL).catch(err => console.error(err));
}


module.exports = {app, runServer, closeServer};