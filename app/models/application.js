var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Application = new mongoose.Schema({
    name: { type: String, required: true },
    token: { type: String }
});

Application.pre('save', function (next) {
    if (this.isNew) {
        this.token = uuid.v4();
    }

    next();
});

Application.set('versionKey', false);

module.exports = mongoose.model('Application', Application);