var assert = require('assert');
var request = require('supertest');
var app = require('../app');
var Application = require('../app/models/application');

describe('Applications', function () {
    describe('POST /applications', function () {
        it('creates new application', function (done) {
            var req = request(app)
                .post('/applications')
                .set('X-Auth-Token', 'secret')
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

    describe('GET /applications', function () {
        beforeEach(function (done) {
            Application.create([{ name: 'Foo' }, { name: 'Bar' }], done);
        });

        it('returns all applications', function (done) {
            var req = request(app)
                .get('/applications')
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

    describe('DELETE /applications/:id', function () {
        beforeEach(function (done) {
            this.app = new Application({ name: 'Foo' });
            this.app.save(done);
        });

        it('deletes application with given id', function (done) {
            var req = request(app)
                .del('/applications/' + this.app._id)
                .set('X-Auth-Token', 'secret')
                .expect(204);

            req.end(done);
        });
    });
});