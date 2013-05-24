var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Client = new mongoose.Schema({
    type: { type: String, required: true },
    token: { type: String }
});

Client.pre('save', function (next) {
    if (this.isNew) {
        this.token = uuid.v4();
    }

    next();
});

Client.set('versionKey', false);

module.exports = mongoose.model('Client', Client);