var express = require('express');
var auth = require('../auth');
var events = require('../events');
var models = require('../models');

var app = module.exports = express();

app.post('/', auth.app, function (req, res, next) {
    var message = new models.Message({ data: req.body });
    message.app = req.app;

    message.save(function (err) {
        if (err) return next(err);

        message.populate('app', function (err, message) {
            if (err) return next(err);

            events.publish(message.toJSON());
            res.json(message, 201);
        });
    });
});

app.get('/', auth.client, function (req, res, next) {
    var query = models.Message.find({}).sort('-timestamp').populate('app');

    if (req.query.since) {
        query = query.where('_id').gt(req.query.since);
    }

    query.exec(function (err, messages) {
        if (err) return next(err);
        res.json(messages);
    });
});