var mongoose = require('mongoose');
var request = require('supertest');
var pushcart = require('../lib');

process.env.AUTH_TOKEN = 'secret';

before(function () {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pushcart_tests');
});

beforeEach(function (done) {
    pushcart.models.Application.remove(done);
});

beforeEach(function (done) {
    pushcart.models.Client.remove(done);
});

beforeEach(function (done) {
    pushcart.models.Message.remove(done);
});