const User = require("../../database/user");
const Load = require("../../database/load");
const firebaseAuthentication = require("../../services/firebase-authentication");
const { CODES, MESSAGES, RESOURCE_OPERATION } = require("../../helper/status-CODES.json");
const utils = require("../../helper/utils");

function response(res, code, data) {
    res.status(code);
    res.json({ data: data, msg: MESSAGES[code] });
    res.end();
}

class UserController {
    //Registering
    async signup(req, res) {
        try {
            console.log("signup");
            let data = req.body;
            let { email, password } = data;
            if (!email || !password) return response(res, CODES.Bad_Request, { error: "email|password required" });
            firebaseAuthentication.createUser({ email, password }).then(async authResult => {
                data["uid"] = authResult.uid;
                let user = new User(data);
                user.save().then(userRes => {
                    return response(res, CODES.OK, authResult);
                }).catch(error => {
                    return response(res, CODES.Internal_Server_Error, { error });
                });
            }).catch(error => { return response(res, CODES.Internal_Server_Error, { error }); });
        } catch (error) {
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async saveCarrierDocument(req, res) {
        try {
            console.log("saveCarrierDocument");
            let { userId } = req.query;
            let files = req.files && req.files.file;
            if (!userId || !files) return response(res, CODES.Bad_Request, { error: "userId|file request" });
            if (!Array.isArray(files)) files = [files];
            let date = new Date();
            let fileUrls = [];
            files.forEach(file => {
                let fileUrl = `${utils.fileUploadPath}/${date.getTime()}-${file.name}`;
                fileUrls.push(fileUrl)
                utils.uploadFile(file, fileUrl).catch(error => { return response(res, CODES.Internal_Server_Error, { error }); });
            });
            let user = new User({});
            user.update(userId, { carrierDocuments: fileUrls }).then(userRes => {
                return response(res, CODES.OK, userRes);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            return response(res, CODES.Bad_Request, { error });
        }
    }
    //Premium Plans
    async savePremiumPlan(req, res) {
        try {
            console.log("savePremiumPlan");
        } catch (error) {
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async getPremiumPlans(req, res) {
        try {
            console.log("getPremiumPlans");
        } catch (error) {
            return response(res, CODES.Bad_Request, { error });
        }
    }
    //Controller as User
    async saveUserLoad(req, res) {
        try {
            console.log("saveUserLoad");
            let { userId } = req.query;
            if (!userId) return response(res, CODES.Bad_Request, { error: "userId required" });
            let data = req.body;
            data["userId"] = userId;
            let load = new Load(data);
            load.save().then(() => {
                return response(res, CODES.OK, RESOURCE_OPERATION.CREATED);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async getUserLoads(req, res) {
        try {
            console.log("getUserLoads");
            let { userId } = req.query;
            if (!userId) return response(res, CODES.Bad_Request, { error: "userId required" });
            let load = new Load({});
            load.getAllUserLoads(userId).then((loadRes) => {
                return response(res, CODES.OK, loadRes);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async getLoadDetail(req, res) {
        try {
            console.log("getLoadDetail");
            let { loadId } = req.query;
            if (!loadId) return response(res, CODES.Bad_Request, { error: "loadId required" });
            let load = new Load({});
            load.getLoad(loadId).then((loadRes) => {
                return response(res, CODES.OK, loadRes);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async getSearchTruckers(req, res) {
        try {
            console.log("getSearchTruckers");
            let { address } = req.query;
            if (!address) return response(res, CODES.Bad_Request, { error: "address required" });
            let user = new User({});
            user.getAllSearchUsers(address.toLowerCase()).then((usersRes) => {
                return response(res, CODES.OK, usersRes);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            console.log(error);
            return response(res, CODES.Bad_Request, error);
        }
    }
    async getTruckerDetail(req, res) {
        try {
            console.log("getTruckerDetail");
            let { truckUserId } = req.query;
            if (!truckUserId) return response(res, CODES.Bad_Request, { error: "truckUserId required" });
            let user = new User({});
            user.getSingleUser(truckUserId).then((usersRes) => {
                return response(res, CODES.OK, usersRes);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async saveTruckerRating(req, res) {
        try {
            console.log("saveTruckerRating");
            let { loadId } = req.query;
            let { rating } = req.body;
            if (!loadId || !rating) return response(res, CODES.Bad_Request, { error: "loadId|rating required" });
            let load = new Load({});
            load.saveTruckerRating(loadId, rating).then((usersRes) => {
                return response(res, CODES.OK, usersRes);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async getTruckerRatings(req, res) {
        try {
            console.log("getTruckerRatings");
            let { truckUserId } = req.query;
            if (!truckUserId) return response(res, CODES.Bad_Request, { error: "truckUserId required" });
            let load = new Load({});
            load.getAllTruckerLoads(truckUserId).then((loadRes) => {
                loadRes = loadRes.map((load) => ({
                    loadId: load.id,
                    truckUserId: load.data.truckUserId,
                    userId: load.data.userId,
                    ...load.data.rating
                }));
                return response(res, CODES.OK, loadRes);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async saveFavTruckerProfile(req, res) {
        try {
            console.log("saveFavTruckerProfile");
            let { userId } = req.query;
            let { favTruckUserIds } = req.body;
            if (!userId || !favTruckUserIds) return response(res, CODES.Bad_Request, { error: "userId|favTruckUserIds required" });
            let user = new User({});
            user.update(userId, { favTruckUserIds }).then((usersRes) => {
                return response(res, CODES.OK, usersRes);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async getFavTruckerProfiles(req, res) {
        try {
            console.log("getFavTruckerProfiles");
            let { userId } = req.query;
            if (!userId) return response(res, CODES.Bad_Request, { error: "userId required" });
            let user = new User({});
            user.getSingleUser(userId).then((usersRes) => {
                return response(res, CODES.OK, { favTruckUserIds: usersRes.favTruckUserIds });
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            return response(res, CODES.Bad_Request, { error });
        }
    }
    //Controller as Trucker
    async getSearchLoads(req, res) {
        try {
            console.log("getSearchLoads");
            let { shippingItem } = req.query;
            if (!shippingItem) return response(res, CODES.Bad_Request, { error: "shippingItem required" });
            let load = new Load({});
            load.getAllSearchLoads(parseInt(shippingItem)).then((loadRes) => {
                return response(res, CODES.OK, loadRes);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async saveLoadBook(req, res) {
        try {
            console.log("saveLoadBook");
            let { loadId } = req.query;
            let { truckUserId } = req.body;
            if (!loadId || !truckUserId) return response(res, CODES.Bad_Request, { error: "loadId|truckUserId required" });
            let load = new Load({});
            load.update(loadId, { truckUserId }).then(() => {
                return response(res, CODES.OK, RESOURCE_OPERATION.UPDATED);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async updateLoadStatus(req, res) {
        try {
            console.log("updateLoadStatus");
            let { loadId } = req.query;
            let { statusShipping } = req.body;
            if (!loadId || !statusShipping) return response(res, CODES.Bad_Request, { error: "loadId|statusShipping required" });
            let load = new Load({});
            load.update(loadId, { statusShipping }).then(() => {
                return response(res, CODES.OK, RESOURCE_OPERATION.UPDATED);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async getUserDetail(req, res) {
        try {
            console.log("getUserDetail");
            let { userId } = req.query;
            if (!userId) return response(res, CODES.Bad_Request, { error: "userId required" });
            let user = new User({});
            user.getSingleUser(userId).then((usersRes) => {
                return response(res, CODES.OK, usersRes);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async saveUserRating(req, res) {
        try {
            console.log("saveUserRating");
            let { loadId } = req.query;
            let { rating } = req.body;
            if (!loadId || !rating) return response(res, CODES.Bad_Request, { error: "loadId|rating required" });
            let load = new Load({});
            load.saveUserRating(loadId, rating).then((usersRes) => {
                return response(res, CODES.OK, usersRes);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async getUserRatings(req, res) {
        try {
            console.log("getUserRatings");
            let { userId } = req.query;
            if (!userId) return response(res, CODES.Bad_Request, { error: "userId required" });
            let load = new Load({});
            load.getAllUserLoads(userId).then((loadRes) => {
                loadRes = loadRes.map((load) => ({
                    loadId: load.id,
                    truckUserId: load.data.truckUserId,
                    userId: load.data.userId,
                    ...load.data.rating
                }));
                return response(res, CODES.OK, loadRes);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async getTruckerLoads(req, res) {
        try {
            console.log("getTruckerLoads");
            let { truckUserId } = req.query;
            if (!truckUserId) return response(res, CODES.Bad_Request, { error: "truckUserId required" });
            let load = new Load({});
            load.getAllTruckerLoads(truckUserId).then((loadRes) => {
                return response(res, CODES.OK, loadRes);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async saveFavLoad(req, res) {
        try {
            console.log("saveFavLoad");
            let { truckUserId } = req.query;
            let { favLoadIds } = req.body;
            if (!truckUserId || !favLoadIds) return response(res, CODES.Bad_Request, { error: "truckUserId|favLoadIds required" });
            let user = new User({});
            user.update(truckUserId, { "truck.favLoadIds": favLoadIds }).then((usersRes) => {
                return response(res, CODES.OK, usersRes);
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async getFavLoads(req, res) {
        try {
            console.log("getFavLoads");
            let { truckUserId } = req.query;
            if (!truckUserId) return response(res, CODES.Bad_Request, { error: "truckUserId required" });
            let user = new User({});
            user.getSingleUser(truckUserId).then((usersRes) => {
                return response(res, CODES.OK, { favLoadIds: usersRes.truck.favLoadIds });
            }).catch(error => {
                return response(res, CODES.Internal_Server_Error, { error });
            });
        } catch (error) {
            return response(res, CODES.Bad_Request, { error });
        }
    }
}

module.exports = new UserController();