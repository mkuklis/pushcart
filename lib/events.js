var events = require('events');
var redis = require('redis');
var url = require('url');

exports.channel = 'pushcart:messages';
exports.emitter = new events.EventEmitter();

exports.connect = function (uri) {
    var parts = url.parse(uri);
    this.client = redis.createClient(parts.port, parts.hostname);

    if (parts.auth) {
        var pass = parts.auth.split(':')[1];
        this.client.auth(pass);
    }
};

exports.publish = function (message) {
    this.client.publish(this.channel, JSON.stringify(message));
};