var mongoose = require('mongoose');
var request = require('supertest');
var app = require('../app');
var Client = require('../app/models/client');

before(function () {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pushcart_tests');
});

beforeEach(function (done) {
    Client.remove(done);
});