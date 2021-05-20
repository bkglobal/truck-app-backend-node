const User = require("../../database/user");
const FreePlan = require("../../database/free-plan");
const Package = require("../../database/package");
const Load = require("../../database/load");
const { parseError, response } = require("../../helper/utils");

// const path = require('path');
// const os = require('os');
// const fs = require('fs');
// const Busboy = require('busboy');

class AdminController {
    //Dashboard Reports
    async getDashboardSummaryStatic(req, res) {
        try {
            console.log("getDashboardSummaryStatic");
            let data = {};
            data.totalUsers = (await new User({}).getAllUsers().catch(error => { throw error })).length;
            data.completedLoads = (await new Load({}).getAllCompletedLoads().catch(error => { throw error })).length;
            response(res, parseError(), data);
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async getDashboardSummaryDynamic(req, res) {
        try {
            console.log("getDashboardSummaryDynamic");
            const { startDate, endDate } = req.body;
            let data = {};
            data.newUsers = (await new User({}).getAllUsersInDateRange(startDate, endDate).catch(error => { throw error })).length;
            data.loadPosting = (await new Load({}).getAllUsersInDateRange(startDate, endDate).catch(error => { throw error }));
            response(res, parseError(), data);
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    //Free Plan
    async saveFreePlan(req, res) {
        try {
            console.log("saveFreePlan");
            let plan = new FreePlan(req.body);
            plan.save().then(planRes => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async getFreePlan(req, res) {
        try {
            console.log("getFreePlan");
            let plan = new FreePlan({});
            plan.getPlan().then(planRes => {
                return response(res, parseError(), planRes);
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async updateFreePlan(req, res) {
        try {
            console.log("updateFreePlan");
            let plan = new FreePlan({});
            plan.update(req.body).then(planRes => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    //Packages
    async getAllPackages(req, res) {
        try {
            console.log("getAllPackages");
            let obj = new Package({});
            obj.getAll().then(packageRes => {
                return response(res, parseError(), packageRes);
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async savePackage(req, res) {
        try {
            console.log("savePackage");
            let obj = new Package(req.body);
            obj.save().then(objRes => {
                return response(res, parseError(), objRes);
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async getPackage(req, res) {
        try {
            console.log("getPackage");
            let { packageId } = req.query;
            if (!packageId) return response(res, parseError('packageId'), {});
            let obj = new Package({});
            obj.get(packageId).then(result => {
                return response(res, parseError(), result);
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async updatePackage(req, res) {
        try {
            console.log("updatePackage");
            let { packageId } = req.query;
            if (!packageId) return response(res, parseError('packageId'), {});
            let obj = new Package(req.body);
            obj.update(packageId).then(result => {
                return response(res, parseError(), {});
            }).catch(error => {
                console.log(error);
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async deletePackage(req, res) {
        try {
            console.log("deletePackage");
            let { packageId } = req.query;
            if (!packageId) return response(res, parseError('packageId'), {});
            let obj = new Package({});
            obj.delete(packageId).then(result => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    //Users
    async getAllUsers(req, res) {
        try {
            console.log("getAllUsers");
            let user = new User({});
            user.getAllUsers().then(userRes => {
                return response(res, parseError(), userRes);
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async getUser(req, res) {
        try {
            console.log("getUser");
            let { userId } = req.query;
            if (!userId) return response(res, parseError('userId'), {});
            let user = new User({});
            user.getSingleUser(userId).then((usersRes) => {
                return response(res, parseError(), usersRes);
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async updateUser(req, res) {
        try {
            console.log("updateUser");
            let { userId } = req.query;
            if (!userId) return response(res, parseError('userId'), {});
            let user = new User({});
            user.update(userId, req.body).then(userRes => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async deleteUser(req, res) {
        try {
            console.log("deleteUser");
            let user = new User({});
            user.getAllUsers().then(userRes => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    //Loads
    async getAllLoads(req, res) {
        try {
            console.log("getAllLoads");
            let load = new Load({});
            load.getAllLoads().then(loadRes => {
                return response(res, parseError(), loadRes);
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
}
module.exports = new AdminController();