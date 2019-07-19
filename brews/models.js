'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brewSchema = new Schema({
    title:  {type: String, required: true},
    roasters: {type: String, required: true},
    beansOrigin: {type: String, required: true},
    flavorNotes: {type: [String], default: undefined},
    brewMethod: {type: String, required: true},
    description: {type: String, required: true}
    //userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
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