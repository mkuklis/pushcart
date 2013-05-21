var assert = require('assert');
var request = require('supertest');
var app = require('../app');
var Application = require('../app/models/application');
var Message = require('../app/models/message');

describe('Messages', function () {
    beforeEach(function (done) {
        this.app = new Application({ name: 'Foo' });
        this.app.save(done);
    });

    describe('POST /messages', function () {
        it('creates new message', function (done) {
            var self = this;

            var req = request(app)
                .post('/messages')
                .set('X-App-Token', this.app.token)
                .expect(201)
                .expect('Content-Type', /json/);

            req.end(function (err, res) {
                if (err) return done(err);

                assert.ok(res.body._id);

                done();
            });
        });
    });

    describe('GET /messages', function () {
        beforeEach(function (done) {
            Message.create([
                { app: this.app },
                { app: this.app }
            ], done);
        });

        it('returns all messages', function (done) {
            var req = request(app)
                .get('/messages')
                .set('X-App-Token', this.app.token)
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