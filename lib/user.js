var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  loginCnt:{type: Number, default: 0},
  level:{type: Number, default: 0},
});

User.pre('save', function (next) {
  this.level = Math.floor(this.loginCnt / 10);

  next();
});

User.plugin(passportLocalMongoose);

var userConn = mongoose.createConnection("mongodb://localhost/account");

module.exports = userConn.model('User', User);
