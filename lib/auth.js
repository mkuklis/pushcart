var models = require('./models');

exports.token = function (req, res, next) {
    var token = req.header('X-Auth-Token');
    if (token !== process.env.AUTH_TOKEN) return res.json({ error: 'Unauthorized' }, 401);
    next();
};

exports.app = function (req, res, next) {
    var token = req.header('X-App-Token');

    models.Application.findOne({ token: token }, function (err, app) {
        if (err) return next(err);
        if (!app) return res.json({ error: 'Unauthorized' }, 401);

        req.app = app;
        next();
    });
};

exports.client = function (req, res, next) {
    var token = req.header('X-Client-Token');

    models.Client.findOne({ token: token }, function (err, client) {
        if (err) return next(err);
        if (!client) return res.json({ error: 'Unauthorized' }, 401);

        req.client = client;
        next();
    });
};