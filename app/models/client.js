var mongoose = require('mongoose');

var Client = new mongoose.Schema({
    name: { type: String, required: true }
});

Client.set('versionKey', false);

module.exports = mongoose.model('Client', Client);