var assert = require('assert');
var request = require('supertest');
var app = require('../app');
var Client = require('../app/models/client');

describe('Clients', function () {
    describe('POST /clients', function () {
        it('creates new client', function (done) {
            var req = request(app)
                .post('/clients')
                .send({ name: 'Foo' })
                .expect(201)
                .expect('Content-Type', /json/);

            req.end(function (err, res) {
                if (err) return done(err);

                assert.ok(res.body._id);
                assert.equal(res.body.name, 'Foo');
                assert.ok(res.body.token);

                done();
            });
        });
    });

    describe('GET /clients', function () {
        beforeEach(function (done) {
            Client.create([{ name: 'Foo' }, { name: 'Bar' }], done);
        });

        it('returns all clients', function (done) {
            var req = request(app)
                .get('/clients')
                .expect(200)
                .expect('Content-Type', /json/);

            req.end(function (err, res) {
                if (err) return done(err);

                assert.equal(res.body.length, 2);

                done();
            });
        });
    });
});