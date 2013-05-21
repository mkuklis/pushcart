var express = require('express');
var Application = require('../models/application');
var Message = require('../models/message');

var app = module.exports = express();

app.use(function (req, res, next) {
    var token = req.header('X-App-Token');

    Application.findOne({ token: token }, function (err, app) {
        if (err) return next(err);
        if (!app) return res.json({ error: 'Unauthorized' }, 401);

        req.app = app;
        next();
    });
});

app.post('/', function (req, res, next) {
    var message = new Message(req.body);
    message.app = req.app;

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