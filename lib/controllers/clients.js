var async = require('async');
var express = require('express');
var auth = require('../auth');
var models = require('../models');

var app = module.exports = express();

app.use(auth.token);

app.post('/', function (req, res, next) {
    models.Client.create(req.body, function (err, client) {
        if (err) return next(err);
        res.json(client, 201);
    });
});

app.get('/', function (req, res, next) {
    var query = models.Client.find({});

    if (req.query.type) {
        query = query.where('type').equals(req.query.type);
    }

    query.exec(function (err, clients) {
        if (err) return next(err);

        async.map(clients, function (client, callback) {
            client.unread(function (err, unread) {
                if (err) return callback(err);

                var data = client.toJSON();
                data.unread = unread;
                callback(null, data);
            });
        }, function (err, clients) {
            if (err) return next(err);
            res.json(clients);
        });
    });
});

app.del('/:id', function (req, res, next) {
    models.Client.findById(req.params.id, function (err, client) {
        if (err) return next(err);
        if (!client) return res.json({ error: 'Not found' }, 404);

        client.remove(function (err) {
            if (err) return callback(err);
            res.send(204);
        });
    });
});