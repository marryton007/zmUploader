var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({});

User.plugin(passportLocalMongoose);

var userConn = mongoose.createConnection("mongodb://localhost/account");

module.exports = userConn.model('User', User);