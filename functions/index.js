const functions = require("firebase-functions");
var express = require("express");
var cookieParser = require("cookie-parser");
var admin = require('./src/services/firebase-init');
var cors = require('cors')({origin: true});
var path = require("path");
var routes = require('./src/routes');
const app=express()
const main=express()

main.use('/api/v1', app)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors);
app.use('/public', express.static(path.resolve(__dirname, 'public')));

exports.app = functions.https.onRequest(main)

app.use('/', routes);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
