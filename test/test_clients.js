var assert = require('assert');
var request = require('supertest');
var pushcart = require('../lib');

describe('Clients', function () {
    describe('POST /clients', function () {
        it('creates new client', function (done) {
            var req = request(pushcart.app)
                .post('/clients')
                .set('X-Auth-Token', 'secret')
                .send({ type: 'foo', info: { foo: 'bar' }})
                .expect(201)
                .expect('Content-Type', /json/);

            req.end(function (err, res) {
                if (err) return done(err);

                assert.ok(res.body._id);
                assert.equal(res.body.type, 'foo');
                assert.deepEqual(res.body.info, { foo: 'bar' });
                assert.ok(res.body.token);

                done();
            });
        });
    });

    describe('GET /clients', function () {
        beforeEach(function (done) {
            this.clients = [
                new pushcart.models.Client({ type: 'foo' }),
                new pushcart.models.Client({ type: 'bar' })
            ];

            pushcart.models.Client.create(this.clients, done);
        });

        it('returns all clients', function (done) {
            var req = request(pushcart.app)
                .get('/clients')
                .set('X-Auth-Token', 'secret')
                .expect(200)
                .expect('Content-Type', /json/);

            req.end(function (err, res) {
                if (err) return done(err);

                assert.equal(res.body.length, 2);
                done();
            });
        });

        it('returns clients of a given type', function (done) {
            var self = this;

            var req = request(pushcart.app)
                .get('/clients?type=bar')
                .set('X-Auth-Token', 'secret')
                .expect(200)
                .expect('Content-Type', /json/);

            req.end(function (err, res) {
                if (err) return done(err);

                assert.equal(res.body.length, 1);
                assert.equal(res.body[0]._id, self.clients[1]._id);
                done();
            });
        });
    });

    describe('DELETE /clients/:id', function () {
        beforeEach(function (done) {
            this.client = new pushcart.models.Client({ type: 'foo' });
            this.client.save(done);
        });

        it('deletes client with given id', function (done) {
            var req = request(pushcart.app)
                .del('/clients/' + this.client._id)
                .set('X-Auth-Token', 'secret')
                .expect(204);

            req.end(done);
        });
    });
});