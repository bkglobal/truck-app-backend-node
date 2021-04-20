var express = require('express');
var userRoute = require('./user/user.routes');
var app = express.Router();

app.use('/user', userRoute);

module.exports = app;
