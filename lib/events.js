var events = require('events');
var redis = require('redis');
var url = require('url');

exports.channel = 'pushcart';
exports.emitter = new events.EventEmitter();

exports.connect = function (uri) {
    var parts = url.parse(uri);
    this.pub = redis.createClient(parts.port, parts.hostname);
    this.sub = redis.createClient(parts.port, parts.hostname);

    if (parts.auth) {
        var pass = parts.auth.split(':')[1];
        this.pub.auth(pass);
        this.sub.auth(pass);
    }
};

exports.publish = function (message) {
    this.pub.publish(this.channel, JSON.stringify(message));
};

var subscribed = false;

exports.subscribe = function (callback) {
    if (!subscribed) {
        this.sub.subscribe(this.channel);
        this.sub.on('message', function (channel, message) {
            exports.emitter.emit('message', JSON.parse(message));
        });
    }

    this.emitter.on('message', callback);
};