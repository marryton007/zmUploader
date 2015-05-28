'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var fileConn = mongoose.createConnection("mongodb://localhost/upfile");

//upFile schema
var upFileSchema = new Schema({
	name: String,
	url: String,
	date: Date,
	username: String
});

//upFile model
var upFile = fileConn.model('upFile', upFileSchema);

module.exports = upFile;



