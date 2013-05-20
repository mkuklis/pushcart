var express = require('express');
var mongoose = require('mongoose');

var app = module.exports = express();

app.use(express.bodyParser());

app.use('/clients', require('./controllers/clients'));