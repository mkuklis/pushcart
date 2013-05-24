var express = require('express');
var auth = require('../lib/auth');
var Application = require('../models/application');

var app = module.exports = express();

app.use(auth.token);

app.post('/', function (req, res, next) {
    Application.create(req.body, function (err, app) {
        if (err) return next(err);
        res.json(app, 201);
    });
});

app.get('/', function (req, res, next) {
    Application.find(function (err, clients) {
        if (err) return next(err);
        res.json(clients);
    });
});

app.del('/:id', function (req, res, next) {
    Application.findById(req.params.id, function (err, app) {
        if (err) return next(err);
        if (!app) return res.json({ error: 'Not found' }, 404);

        app.remove(function (err) {
            if (err) return callback(err);
            res.send(204);
        });
    });
});