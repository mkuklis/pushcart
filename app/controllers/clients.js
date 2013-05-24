var express = require('express');
var auth = require('../lib/auth');
var Client = require('../models/client');

var app = module.exports = express();

app.use(auth.token);

app.post('/', function (req, res, next) {
    Client.create(req.body, function (err, client) {
        if (err) return next(err);
        res.json(client, 201);
    });
});

app.get('/', function (req, res, next) {
    var query = Client.find({});

    if (req.query.type) {
        query = query.where('type').equals(req.query.type);
    }

    query.exec(function (err, clients) {
        if (err) return next(err);
        res.json(clients);
    });
});

app.del('/:id', function (req, res, next) {
    Client.findById(req.params.id, function (err, client) {
        if (err) return next(err);
        if (!client) return res.json({ error: 'Not found' }, 404);

        client.remove(function (err) {
            if (err) return callback(err);
            res.send(204);
        });
    });
});