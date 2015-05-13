'use strict';

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: String,
    gender: String,
    age: Number
});

var User = mongoose.model('User', userSchema);

module.exports = User;