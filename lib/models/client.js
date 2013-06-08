var mongoose = require('mongoose');
var uuid = require('node-uuid');
var Message = require('./message');
var ObjectId = mongoose.Schema.ObjectId;

var Client = new mongoose.Schema({
    type: { type: String, required: true },
    token: { type: String, unique: true },
    last: { type: ObjectId, ref: 'Message' },
    info: {}
});

Client.pre('save', function (next) {
    if (this.isNew) {
        this.token = uuid.v4().replace(/-/g, '');
    }

    next();
});

Client.set('versionKey', false);

Client.methods.unread = function (callback) {
    if (this.last) {
        Message.count({ _id: { $gt: this.last }}, callback);
    } else {
        Message.count(callback);
    }
};

module.exports = mongoose.model('Client', Client);