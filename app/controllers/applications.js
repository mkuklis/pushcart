var express = require('express');
var Application = require('../models/application');

var app = module.exports = express();

app.use(function (req, res, next) {
    var token = req.header('X-Auth-Token');
    if (token !== process.env.AUTH_TOKEN) return res.json({ error: 'Unauthorized' }, 401);
    next();
});

app.post('/', function (req, res, next) {
    Application.create(req.body, function (err, client) {
        if (err) return next(err);
        res.json(client, 201);
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