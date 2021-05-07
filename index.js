var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var routes = require('./src/routes');
require('./src/services/firebase-init');
const PORT = process.env.PORT || 3000;
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static(path.resolve(__dirname, 'public')));
app.get('/', (req, res) => {res.send("Welcome to SkidsterApp")});
app.use('/api/v1/', routes);
app.listen(PORT, ()=>console.log("http://localhost:3000/"));