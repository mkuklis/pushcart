var express = require('express');
var auth = require('../lib/auth');
var Message = require('../models/message');

var app = module.exports = express();

app.post('/', auth.app, function (req, res, next) {
    var message = new Message(req.body);
    message.app = req.app;

    message.save(function (err) {
        if (err) return next(err);
        res.json(message, 201);
    });
});

app.get('/', auth.token, function (req, res, next) {
    Message.find(function (err, messages) {
        if (err) return next(err);
        res.json(messages);
    });
});