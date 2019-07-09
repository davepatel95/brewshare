'use strict';

const mongoose = require('mongoose');
const faker = require('faker');

const { Brews } = require('../models/brews');

function seedBrewData() {
    return new Promise((resolve, reject) => {
        let testBrew = generateBrewData();
        Brews.hashPassword(testBrew.plainPassword)
            .then(hash => {
                testBrew.password = hash;
                return Brew.create(testBrew);
            })
            then(res => {
                resolve([res]);
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
    seedBrewData,
    generateBrewData,
    generateFlavorNotes
};