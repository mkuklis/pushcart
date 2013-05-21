var Application = require('../models/application');

exports.token = function (req, res, next) {
    var token = req.header('X-Auth-Token');
    if (token !== process.env.AUTH_TOKEN) return res.json({ error: 'Unauthorized' }, 401);
    next();
};

exports.app = function (req, res, next) {
    var token = req.header('X-App-Token');

    Application.findOne({ token: token }, function (err, app) {
        if (err) return next(err);
        if (!app) return res.json({ error: 'Unauthorized' }, 401);

        req.app = app;
        next();
    });
};