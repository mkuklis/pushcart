var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var Message = new mongoose.Schema({
    app: { type: ObjectId, ref: 'Application', required: true },
    data: {}
});

Message.methods.toJSON = function () {
    var msg = this.toObject();
    delete msg.app;
    
    for (var key in msg.data) {
        msg[key] = msg.data[key];
    }

    return msg;
};

Message.set('versionKey', false);

module.exports = mongoose.model('Message', Message);