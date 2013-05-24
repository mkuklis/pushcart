var express = require('express');
var mongoose = require('mongoose');
var pkg = require('../package');

var app = module.exports = express();

app.use(express.bodyParser());

app.get('/', function (req, res) {
    res.json({ version: pkg.version });
});

app.use('/applications', require('./controllers/applications'));
app.use('/clients', require('./controllers/clients'));
app.use('/messages', require('./controllers/messages'));