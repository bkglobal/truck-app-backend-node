const functions = require("firebase-functions");
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const fileParser = require('express-multipart-file-parser');
const fileUpload = require('express-fileupload');
var routes = require('./src/routes');
//var logger = require('morgan');
require('./src/services/firebase-init');
const PORT = process.env.PORT || 3000;
var app = express();

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static(path.resolve(__dirname, 'public')));
//app.use(fileUpload());
//app.use(fileParser);
app.get('/hello', (req, res) => res.send("Welcome to Truck App"));
app.use('/api/v1/', routes);
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.app = functions.https.onRequest(app);
