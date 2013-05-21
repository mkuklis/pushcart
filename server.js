var mongoose = require('mongoose');
var app = require('./app');
var events = require('./app/lib/events');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pushcart');
events.connect(process.env.REDIS_URI || 'redis://localhost:6379');

app.listen(process.env.PORT || 3000);