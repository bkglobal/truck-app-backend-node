const {request, response} = require('express');
const statusCodes = require('../helper/statusCodes.json');
const firebaseAuthentication = require("../services/firebase-authentication")

    /**
     * @param {request} req
     * @param {response} res 
     * @param {Function} next
    */
module.exports.isAuthenticated = (req, res, next) => {
    let token = req.headers.authorization || '';
    if(!token) return res.status(403).send('Token Required!');
    firebaseAuthentication.isAuthenticated(token).then(() => {
        return next();
    }).catch(error => {
        return res.status(403).send('Unauthorized');
    })
}