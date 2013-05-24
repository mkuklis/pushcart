var assert = require('assert');
var request = require('supertest');
var app = require('../app');
var Client = require('../app/models/client');

describe('Clients', function () {
    describe('POST /clients', function () {
        it('creates new client', function (done) {
            var req = request(app)
                .post('/clients')
                .set('X-Auth-Token', 'secret')
                .send({ type: 'foo' })
                .expect(201)
                .expect('Content-Type', /json/);

            req.end(function (err, res) {
                if (err) return done(err);

                assert.ok(res.body._id);
                assert.equal(res.body.type, 'foo');
                assert.ok(res.body.token);

                done();
            });
        });
    });

    describe('DELETE /clients/:id', function () {
        beforeEach(function (done) {
            this.client = new Client({ type: 'foo' });
            this.client.save(done);
        });

        it('deletes client with given id', function (done) {
            var req = request(app)
                .del('/clients/' + this.client._id)
                .set('X-Auth-Token', 'secret')
                .expect(204);

            req.end(done);
        });
    });
});