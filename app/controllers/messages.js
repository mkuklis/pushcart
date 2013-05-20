var express = require('express');
var Client = require('../models/client');
var Message = require('../models/message');

var app = module.exports = express();

app.use(function (req, res, next) {
    var token = req.header('X-Client-Token');

    Client.findOne({ token: token }, function (err, client) {
        if (err) return next(err);
        if (!client) return res.json({ error: 'Unauthorized' }, 401);

        req.client = client;
        next();
    });
});

app.post('/', function (req, res, next) {
    var message = new Message(req.body);
    message.client = req.client;

    message.save(function (err) {
        if (err) return next(err);
        res.json(message, 201);
    });
});

app.get('/', function (req, res, next) {
    Message.find(function (err, messages) {
        if (err) return next(err);
        res.json(messages);
    });
});