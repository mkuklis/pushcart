var express = require('express');

var app = express();

app.get('/', function (req, res) {
    res.json({ ok: true });
});

app.listen(process.env.PORT || 3000);