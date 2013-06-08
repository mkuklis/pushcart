var assert = require('assert');
var sinon = require('sinon');
var request = require('supertest');
var format = require('util').format;
var pushcart = require('../lib');

describe('Messages', function () {
    beforeEach(function (done) {
        this.publish = sinon.stub(pushcart.events, 'publish');
        this.app = new pushcart.models.Application({ name: 'Foo' });
        this.app.save(done);
    });

    afterEach(function () {
        this.publish.restore();
    });

    describe('POST /messages', function () {
        it('creates new message', function (done) {
            var req = request(pushcart.app)
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

            var req = request(pushcart.app)
                .post('/messages')
                .set('X-App-Token', this.app.token)
                .expect('Content-Type', /json/)
                .send({ foo: 'bar' });

            req.end(function (err, res) {
                if (err) return done(err);

                assert.ok(self.publish.calledOnce);
                
                var msg = self.publish.getCall(0).args[0];
                assert.ok(msg._id);
                assert.equal(msg.foo, 'bar');
                assert.ok(msg.app._id);
                assert.ok(msg.app.name);

                done();
            });
        });
    });

    describe('GET /messages', function () {
        beforeEach(function (done) {
            this.client = new pushcart.models.Client({ type: 'foo' });
            this.client.save(done);
        });

        beforeEach(function (done) {
            this.messages = [
                new pushcart.models.Message({ app: this.app }),
                new pushcart.models.Message({ app: this.app })
            ];

            pushcart.models.Message.create(this.messages, done);
        });

        it('returns all messages', function (done) {
            var req = request(pushcart.app)
                .get('/messages')
                .set('X-Client-Token', this.client.token)
                .expect(200)
                .expect('Content-Type', /json/);

            req.end(function (err, res) {
                if (err) return done(err);

                assert.equal(res.body.length, 2);
                assert.ok(res.body[0].app._id);
                assert.ok(res.body[0].app.name);
                assert.ok(res.body[0].timestamp);
                assert.ok(res.body[0].timestamp >= res.body[1].timestamp);

                done();
            });
        });

        it('returns messages created since a given id', function (done) {
            var self = this;

            var req = request(pushcart.app)
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

        it('marks last read message for client', function (done) {
            var self = this;

            var req = request(pushcart.app)
                .get('/messages')
                .set('X-Client-Token', this.client.token)
                .expect(200)
                .expect('Content-Type', /json/);

            req.end(function (err, res) {
                if (err) return done(err);

                pushcart.models.Client.findById(self.client._id, function (err, client) {
                    if (err) return done(err);

                    assert.equal(client.last.toString(), self.messages[0]._id.toString());
                    done();
                });
            });
        });
    });
});