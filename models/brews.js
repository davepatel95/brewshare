'use strict';

const mongoose = require('mongoose');

const brewSchema = mongoose.Schema({
    title: {type: String, required: true},
    roasters: {type: String},
    beansOrigin: {type: String},
    flavorNotes: {type: Array, default: []},
    brewMethod: {type: String},
    description: {type: String},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

brewSchema.methods.serialize = function() {
    return {
        id: this._id,
        title: this.title,
        roasters: this.roasters,
        beansOrigin: this.beansOrigin,
        flavorNotes: this.flavorNotes,
        brewMethod: this.brewMethod,
        description: this.description
    };
};

const Brew = mongoose.model('Brew', brewSchema);

module.exports = { Brew };