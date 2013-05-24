var express = require('express');
var auth = require('../auth');
var models = require('../models');

var app = module.exports = express();

app.use(auth.token);

app.post('/', function (req, res, next) {
    models.Application.create(req.body, function (err, app) {
        if (err) return next(err);
        res.json(app, 201);
    });
});

app.get('/', function (req, res, next) {
    models.Application.find(function (err, clients) {
        if (err) return next(err);
        res.json(clients);
    });
});

app.del('/:id', function (req, res, next) {
    models.Application.findById(req.params.id, function (err, app) {
        if (err) return next(err);
        if (!app) return res.json({ error: 'Not found' }, 404);

        app.remove(function (err) {
            if (err) return callback(err);
            res.send(204);
        });
    });
});