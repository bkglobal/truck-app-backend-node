var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('./src/services/firebase-init');
const PORT = process.env.PORT || 3000;
var routes = require('./src/routes');
const fileUpload = require('express-fileupload');
var app = express();

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

app.use('/api/v1/', routes)
app.listen(PORT, ()=>console.log("http://localhost:3000/"));