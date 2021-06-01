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
            data.totalUsers = (await new User({}).getAllLength().catch(error => { throw error }));
            data.completedLoads = (await new Load({}).getAllCompletedLoadsLength().catch(error => { throw error }));
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
            data.newUsers = (await new User({}).getAllUsersInDateRange(startDate, endDate).catch(error => { throw error }));
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
            new FreePlan(req.body).save().then(() => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async getFreePlan(req, res) {
        try {
            console.log("getFreePlan");
            new FreePlan({}).getPlan().then(result => {
                return response(res, parseError(), result);
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async updateFreePlan(req, res) {
        try {
            console.log("updateFreePlan");
            new FreePlan({}).update(req.body).then(() => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    //Packages
    async getAllPackages(req, res) {
        try {
            console.log("getAllPackages");
            new Package({}).getAll().then(result => {
                return response(res, parseError(), result);
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async savePackage(req, res) {
        try {
            console.log("savePackage");
            new Package(req.body).save().then(result => {
                return response(res, parseError(), result);
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
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
            new Package({}).get(packageId).then(result => {
                return response(res, parseError(), result);
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
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
            new Package({}).update(packageId, req.body).then(() => {
                return response(res, parseError(), {});
            }).catch(error => {
                console.log(error);
                return response(res, parseError(error.code || "error"), {});
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
            new Package({}).delete(packageId).then(() => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    //Users
    async getAllUsers(req, res) {
        try {
            console.log("getAllUsers");
            new User({}).getAll().then(result => {
                return response(res, parseError(), result);
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
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
            new User({}).getSingleUser(userId).then((result) => {
                return response(res, parseError(), result);
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async deleteUser(req, res) {
        try {
            console.log("deleteUser");
            new User({}).getAll().then(() => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    //Loads
    async getAllLoads(req, res) {
        try {
            console.log("getAllLoads");
            new Load({}).getAll().then(result => {
                return response(res, parseError(), result);
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
}
module.exports = new AdminController();