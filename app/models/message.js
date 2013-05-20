var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var Message = new mongoose.Schema({
    client: { type: ObjectId, ref: 'Client', required: true }
});

Message.methods.toJSON = function () {
    var data = this.toObject();
    delete data.client;
    return data;
};

Message.set('versionKey', false);

module.exports = mongoose.model('Message', Message);