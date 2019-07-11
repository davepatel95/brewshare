'use strict';
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL, JWT_SECRET } = require("./config");

const brewsRouter = require('./routers/brewsRouter');
const authRouter = require('./routers/authRouter');
const userRouter = require('./routers/usersRouter');

const app = express();
app.use(express.json());
app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());

app.use('/brews', brewsRouter);


let server;
function runServer(DATABASE_URL, port = PORT,) {
    return new Promise((resolve, reject) => {
        mongoose.connect(
            DATABASE_URL, { useNewUrlParser: true}, 
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
