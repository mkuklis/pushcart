var express = require('express');
var sse = require('sse');
var auth = require('../lib/auth');
var events = require('../lib/events');

var app = module.exports = express();

app.get('/', auth.token, function (req, res, next) {
    var client = new sse.Client(req, res);
    client.initialize();

    var listener = function (message) {
        client.send(undefined, JSON.stringify(message), message._id);
    };

    events.on('message', listener);

    req.on('close', function () {
        events.removeListener('message', listener);
        client.close();
    });
});