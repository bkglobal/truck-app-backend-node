var admin = require("firebase-admin");
var serviceAccount = require("../../private/hairdos-52cdc-firebase-adminsdk-bfvpj-f559501825.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
module.exports = admin;

// firebaseAdmin.auth().

// var firebaseConfig = {
//     apiKey: "AIzaSyBJHsFdRHwkO3KKReOJCFKTtHWrSAYEBOI",
//     authDomain: "truckloader-app.firebaseapp.com",
//     projectId: "truckloader-app",
//     storageBucket: "truckloader-app.appspot.com",
//     messagingSenderId: "579504594314",
//     appId: "1:579504594314:web:17c70fd1c7811207b83c73",
//     measurementId: "G-RQH5NS8Z16"
//   };