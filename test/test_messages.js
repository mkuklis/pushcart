var assert = require('assert');
var EventSource = require('eventsource');
var request = require('supertest');
var format = require('util').format;
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
            var server = app.listen();
            var url = format('http://localhost:%d/events', server.address().port);
            
            var es = new EventSource(url, {
                headers: {
                    'X-Auth-Token': 'secret'
                }
            });

            es.onerror = function () {
                done('onerror called');
            };

            es.onmessage = function (e) {
                var data = JSON.parse(e.data);
                assert.ok(data._id);
                
                es.close();
                server.close();
                done();
            };

            var req = request(server)
                .post('/messages')
                .set('X-App-Token', this.app.token)
                .expect('Content-Type', /json/);

            req.end(function (err, res) {
                if (err) return done(err);
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