const User = require("../../database/user");
const FreePlan = require("../../database/free-plan");
const Package = require("../../database/package");
const Load = require("../../database/load");
const firebaseAuthentication = require("../../services/firebase-authentication");
const { CODES, MESSAGES, RESOURCE_OPERATION } = require("../../helper/statusCodes.json");
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
    async saveFreePlan(req, res) {
        try {
            console.log("saveFreePlan");
            let plan = new FreePlan(req.body);
            plan.save().then(planRes => {
                return response(res, CODES.OK, RESOURCE_OPERATION.CREATED);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            console.log(error);
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async getFreePlan(req, res) {
        try {
            console.log("getFreePlan");
            let plan = new FreePlan({});
            plan.getPlan().then(planRes => {
                return response(res, CODES.OK, planRes);
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
            let plan = new FreePlan({});
            plan.update(req.body).then(planRes => {
                return response(res, CODES.OK, RESOURCE_OPERATION.UPDATED);
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
            let obj = new Package({});
            obj.getAll().then(packageRes => {
                return response(res, CODES.OK, packageRes);
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
            let obj = new Package(req.body);
            obj.save().then(objRes => {
                return response(res, CODES.OK, RESOURCE_OPERATION.CREATED);
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
            let { packageId } = req.query;
            if (!packageId) return response(res, CODES.Bad_Request, { error: "packageId required" });
            let obj = new Package({});
            obj.get(packageId).then(result => {
                return response(res, CODES.OK, result);
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
            let { packageId } = req.query;
            if (!packageId) return response(res, CODES.Bad_Request, { error: "packageId required" });
            let obj = new Package(req.body);
            obj.update(packageId).then(result => {
                return response(res, CODES.OK, RESOURCE_OPERATION.UPDATED);
            }).catch(error => {
                console.log(error);
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
            let { packageId } = req.query;
            if (!packageId) return response(res, CODES.Bad_Request, { error: "packageId required" });
            let obj = new Package({});
            obj.get().then(result => {
                return response(res, CODES.OK, result);
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