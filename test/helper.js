var mongoose = require('mongoose');
var request = require('supertest');
var app = require('../app');
var Application = require('../app/models/application');
var Message = require('../app/models/message');

process.env.AUTH_TOKEN = 'secret';

before(function () {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pushcart_tests');
});

beforeEach(function (done) {
    Application.remove(done);
});

beforeEach(function (done) {
    Message.remove(done);
});