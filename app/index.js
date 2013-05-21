var express = require('express');
var mongoose = require('mongoose');

var app = module.exports = express();

app.use(express.bodyParser());

app.use('/applications', require('./controllers/applications'));
app.use('/messages', require('./controllers/messages'));