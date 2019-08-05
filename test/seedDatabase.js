'use strict';

const mongoose = require('mongoose');
const faker = require('faker');

const { Brew } = require('../brews/models');
const { User } = require('../users/models');

function seedDatabase() {
    return new Promise((resolve, reject) => {
        seedUserData()
            .then(users => {
                let userIdArray = users.map(user => user._id);
                return seedBrewData(userIdArray);
            })
            .then(brews => {
                resolve(brews);
            })
            .catch(err => reject(err));
    });
}

function tearDownDb() {
    return new Promise((resolve, reject) => {
        mongoose.connection
            .dropDatabase()
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}

//User Data Functions

function seedUserData() {
    return new Promise((resolve, reject) => {
        let testUser = generateUserData();
        User.hashPassword(testUser.plainPassword)
            .then(hash => {
                testUser.password = hash;
                return User.create(testUser);
            })
            .then(res => {
                resolve([res]);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}

function generateUserData() {
    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        username: faker.internet.userName(),
        password: "123Password",
        plainPassword: "123Password"
    };
}

const preAuthUser = function(user) {
    const plainPassword = "123Password";
    return {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        plainPassword: plainPassword,
        userId: String(user._id)
    };
};

//Brew Data Functions

function seedBrewData(userIdArray) {
    return new Promise((resolve, reject) => {
        const seedData = [];
        for (let i = 0; i <= 2; i++) {
            seedData.push(generateBrewData(userIdArray));
        }
        Brew.insertMany(seedData)
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}

function generateBrewData() {
    return {
        title: faker.name.title(),
        author: faker.name.firstName() + faker.name.lastName(),
        roasters: faker.lorem.words(),
        beansOrigin: faker.address.country(),
        flavorNotes: generateFlavorNotes(),
        brewMethod: faker.lorem.word(),
        description: faker.lorem.sentences()
    }
}

function generateFlavorNotes() {
    const flavorNotes = [
        'melon', 'strawberries', 'earthy', 'fruity', 'lavender', 'apple', 'chocolate', 'caramel', 'nutty', 'cinnamon', 'toffee'
    ];
    return flavorNotes[Math.floor(Math.random() * flavorNotes.length)];
}

module.exports = {
    seedDatabase,
    tearDownDb,
    generateUserData,
    generateBrewData,
    generateFlavorNotes,
    preAuthUser
};