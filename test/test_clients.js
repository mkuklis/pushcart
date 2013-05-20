var assert = require('assert');
var request = require('supertest');
var app = require('../app');

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

                done();
            });
        });
    });
});