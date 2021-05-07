const User = require("../../database/user");
const Load = require("../../database/load");
const firebaseAuthentication = require("../../services/firebase-authentication");
const { CODES, MESSAGES, RESOURCE_OPERATION } = require("../../helper/status-CODES.json");
const utils = require("../../helper/utils");
const logger = require("firebase-functions/lib/logger");
function response(res, code, data) {
    res.status(code);
    res.json({ data: data, msg: MESSAGES[code] });
    res.end();
}

const path = require('path');
const os = require('os');
const fs = require('fs');
const Busboy = require('busboy');

class UserController {
    //Dashboard Reports
    //Users
    async getAllUsers(req, res) {
        try {
            console.log("getAllUsers");
            let user = new User({});
            user.getAllUsers().then(userRes => {
                return response(res, CODES.OK, userRes);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            console.log(error);
            return response(res, CODES.Bad_Request, { error });
        }
    }
    //Free Plan
    async getFreePlan(req, res) {
        try {
            console.log("getFreePlan");
            let user = new User({});
            user.getAllUsers().then(userRes => {
                return response(res, CODES.OK, userRes);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            console.log(error);
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async updateFreePlan(req, res) {
        try {
            console.log("updateFreePlan");
            let user = new User({});
            user.getAllUsers().then(userRes => {
                return response(res, CODES.OK, userRes);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            console.log(error);
            return response(res, CODES.Bad_Request, { error });
        }
    }
    //Packages
    async getAllPackages(req, res) {
        try {
            console.log("getAllPackages");
            let user = new User({});
            user.getAllUsers().then(userRes => {
                return response(res, CODES.OK, userRes);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            console.log(error);
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async savePackage(req, res) {
        try {
            console.log("savePackage");
            let user = new User({});
            user.getAllUsers().then(userRes => {
                return response(res, CODES.OK, userRes);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            console.log(error);
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async getPackage(req, res) {
        try {
            console.log("getPackage");
            let user = new User({});
            user.getAllUsers().then(userRes => {
                return response(res, CODES.OK, userRes);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            console.log(error);
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async updatePackage(req, res) {
        try {
            console.log("updatePackage");
            let user = new User({});
            user.getAllUsers().then(userRes => {
                return response(res, CODES.OK, userRes);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            console.log(error);
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async deletePackage(req, res) {
        try {
            console.log("deletePackage");
            let user = new User({});
            user.getAllUsers().then(userRes => {
                return response(res, CODES.OK, userRes);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            console.log(error);
            return response(res, CODES.Bad_Request, { error });
        }
    }
}
module.exports = new UserController();