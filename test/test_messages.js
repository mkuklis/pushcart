var assert = require('assert');
var sinon = require('sinon');
var request = require('supertest');
var format = require('util').format;
var app = require('../app');
var events = require('../app/lib/events');
var Application = require('../app/models/application');
var Message = require('../app/models/message');

describe('Messages', function () {
    beforeEach(function (done) {
        this.publish = sinon.stub(events, 'publish');
        this.app = new Application({ name: 'Foo' });
        this.app.save(done);
    });

    afterEach(function () {
        this.publish.restore();
    });

    describe('POST /messages', function () {
        it('creates new message', function (done) {
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

        it('publishes message event', function (done) {
            var self = this;

            var req = request(app)
                .post('/messages')
                .set('X-App-Token', this.app.token)
                .expect('Content-Type', /json/);

            req.end(function (err, res) {
                if (err) return done(err);

                assert.ok(self.publish.calledOnce);
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
                .set('X-Auth-Token', 'secret')
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