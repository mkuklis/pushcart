var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var Message = new mongoose.Schema({
    app: { type: ObjectId, ref: 'Application', required: true }
});

Message.methods.toJSON = function () {
    var data = this.toObject();
    delete data.app;
    return data;
};

Message.set('versionKey', false);

module.exports = mongoose.model('Message', Message);