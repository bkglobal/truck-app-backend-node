const functions = require("firebase-functions");
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
//const fileUpload = require('express-fileupload');
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
app.use('/api/v1/', routes);
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
let abc = 0;
exports.app = functions.https.onRequest(app);

// const functions = require('firebase-functions');
// const express = require('express');
// const app = express();
// app.get('/bigben', (req, res) => {
//   const date = new Date();
//   const hours = (date.getHours() % 12) + 1;  // London is UTC + 1hr;
//   res.send(`
//       <!doctype html>
//       <head>
//         <title>Time</title>
//         <link rel="stylesheet" href="/style.css">
//         <script src="/script.js"></script>
//       </head>
//       <body>
//         <p>In London, the clock strikes:
//           <span id="bongs">${'BONG '.repeat(hours)}</span></p>
//         <button onClick="refresh(this)">Refresh</button>
//       </body>
//     </html>`);
// });

// app.get('/api', (req, res) => {
//   const date = new Date();
//   const hours = (date.getHours() % 12) + 1;  // London is UTC + 1hr;
//   res.json({ bongs: 'BONG '.repeat(hours) });
// });
// exports.app = functions.https.onRequest(app);