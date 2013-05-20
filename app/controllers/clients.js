var express = require('express');
var Client = require('../models/client');

var app = module.exports = express();

app.post('/', function (req, res, next) {
    Client.create(req.body, function (err, client) {
        if (err) return next(err);
        res.json(client, 201);
    });
});

app.get('/', function (req, res, next) {
    Client.find(function (err, clients) {
        if (err) return next(err);
        res.json(clients);
    });
});