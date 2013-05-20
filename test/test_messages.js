var assert = require('assert');
var request = require('supertest');
var app = require('../app');
var Client = require('../app/models/client');

describe('Messages', function () {
    beforeEach(function (done) {
        this.client = new Client({ name: 'Foo' });
        this.client.save(done);
    });

    describe('POST /messages', function () {
        it('creates new message', function (done) {
            var self = this;

            var req = request(app)
                .post('/messages')
                .set('X-Client-Token', this.client.token)
                .expect(201)
                .expect('Content-Type', /json/);

            req.end(function (err, res) {
                if (err) return done(err);

                assert.ok(res.body._id);

                done();
            });
        });
    });
});