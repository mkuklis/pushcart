var assert = require('assert');
var sinon = require('sinon');
var request = require('supertest');
var format = require('util').format;
var app = require('../app');
var events = require('../app/lib/events');
var Application = require('../app/models/application');
var Client = require('../app/models/client');
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
                .expect('Content-Type', /json/)
                .send({ foo: 'bar' });

            req.end(function (err, res) {
                if (err) return done(err);

                assert.ok(res.body._id);
                assert.equal(res.body.foo, 'bar');
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
            this.client = new Client({ type: 'foo' });
            this.client.save(done);
        });

        beforeEach(function (done) {
            this.messages = [
                new Message({ app: this.app }),
                new Message({ app: this.app })
            ];

            Message.create(this.messages, done);
        });

        it('returns all messages', function (done) {
            var req = request(app)
                .get('/messages')
                .set('X-Client-Token', this.client.token)
                .expect(200)
                .expect('Content-Type', /json/);

            req.end(function (err, res) {
                if (err) return done(err);

                assert.equal(res.body.length, 2);
                done();
            });
        });

        it('returns messages created since a given id', function (done) {
            var self = this;

            var req = request(app)
                .get('/messages?since=' + this.messages[0]._id)
                .set('X-Client-Token', this.client.token)
                .expect(200)
                .expect('Content-Type', /json/);

            req.end(function (err, res) {
                if (err) return done(err);

                assert.equal(res.body.length, 1);
                assert.equal(res.body[0]._id, self.messages[1]._id);
                done();
            });
        });
    });
});