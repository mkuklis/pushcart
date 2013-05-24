var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var Message = new mongoose.Schema({
    app: { type: ObjectId, ref: 'Application', required: true },
    data: {}
});

Message.methods.toJSON = function () {
    var msg = this.toObject();
    
    for (var key in msg.data) {
        if (!msg[key]) msg[key] = msg.data[key];
    }

    if (msg.app) {
        delete msg.app.token;
    }

    delete msg.data;
    return msg;
};

Message.set('versionKey', false);

module.exports = mongoose.model('Message', Message);