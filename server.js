var mongoose = require('mongoose');
var app = require('./app');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pushcart');
app.listen(process.env.PORT || 3000);