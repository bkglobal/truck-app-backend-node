const User = require("../../database/user");
const Load = require("../../database/load");
const firebaseAuthentication = require("../../services/firebase-authentication");
const { CODES, MESSAGES, RESOURCE_OPERATION } = require("../../helper/statusCodes.json");
const utils = require("../../helper/utils");
const logger = require("firebase-functions/lib/logger");
// function response(res, code, data) {
//     res.status(200);
//     res.json({ data: data, msg: MESSAGES[code] });
//     res.end();
// }
function response(res, { msg, code }, result) {
    res.status(200);
    res.json({ Message: msg, Code: code, Result: result });
    res.end();
}
function parseError(error) {
    console.log(error);
    let obj;
    switch (error) {
        case '-':
            obj = { code: 1, msg: "Operation Successful" };
            break;
        case 'auth/invalid-email':
            obj = { code: 2, msg: "Invalid Email" };
            break;
        case 'auth/invalid-password':
            obj = { code: 3, msg: "Invalid Password" };
            break;
        case 'auth/email-already-exists':
            obj = { code: 4, msg: "Email Already Exist" };
            break;
        case 'userId':
            obj = { code: 5, msg: "userId Required" };
            break;
        case 'truckUserId':
            obj = { code: 6, msg: "truckUserId Required" };
            break;
        case 'file':
            obj = { code: 7, msg: "File Required" };
            break;
        case 'loadId':
            obj = { code: 8, msg: "loadId Required" };
            break;
        case 'address':
            obj = { code: 9, msg: "Address Required" };
            break;
        case 'rating':
            obj = { code: 10, msg: "Rating Required" };
            break;
        case 'shippingItem':
            obj = { code: 11, msg: "Shipping Items Required" };
            break;
        default:
            obj = { code: 0, msg: "Server Error" };
            break;
    }
    return obj;
}
const path = require('path');
const os = require('os');
const fs = require('fs');
const Busboy = require('busboy');

class UserController {
    //Registering
    async signup(req, res) {
        try {
            console.log("signup");
            let data = req.body;
            let { email, password } = data;
            firebaseAuthentication.createUser({ email, password }).then(async ({ uid }) => {
                data["uid"] = uid;
                let user = new User(data);
                user.save().then(() => {
                    return response(res, parseError('-'), { userId: uid });
                }).catch(error => {
                    return response(res, parseError(error.code), {});
                });
            }).catch(error => { return response(res, parseError(error.code), {}); });
        } catch (error) {
            return response(res, parseError(), {});
        }
    }
    async saveCarrierDocument(req, res) {
        try {
            // let { userId } = req.query;
            // if (!userId) return response(res, CODES.Bad_Request, { error: "userId required" });
            // const busboy = new Busboy({ headers: req.headers });
            // const dir = "public/docs";
            // const uploads = {};
            // const fileWrites = [];
            // busboy.on('file', (fieldname, file, filename) => {
            //     const filepath = `${dir}/${Date.now()}-${filename}`///path.join(dir, `${Date.now()}-${filename}`);
            //     uploads[fieldname] = filepath;
            //     const writeStream = fs.createWriteStream(filepath);
            //     file.pipe(writeStream);
            //     const promise = new Promise((resolve, reject) => {
            //         file.on('end', () => {
            //             writeStream.end();
            //         });
            //         writeStream.on('finish', resolve);
            //         writeStream.on('error', reject);
            //     });
            //     fileWrites.push(promise);
            // });
            // busboy.on('finish', async () => {
            //     await Promise.all(fileWrites);
            //     /**
            //      * TODO(developer): Process saved files here
            //      */
            //     let user = new User({});
            //     user.update(userId, { carrierDocuments: uploads.file }).then(userRes => {
            //         response(res, CODES.OK, userRes);
            //     }).catch(error => {
            //         response(res, CODES.Internal_Server_Error, { error });
            //     });
            // });
            // busboy.end(req.rawBody);
            //return req.pipe(busboy);
            /////
            ///
            console.log("saveCarrierDocument");
            let { userId } = req.query;
            if (!userId) return response(res, parseError('userId'), {});
            let files = req.files && req.files.file;
            if (!files) return response(res, parseError('file'), {});
            if (!Array.isArray(files)) files = [files];
            let date = new Date();
            let fileUrls = [];
            files.forEach(file => {
                let fileUrl = `${utils.fileUploadPath}/${date.getTime()}-${file.name}`;
                fileUrls.push(fileUrl)
                utils.uploadFile(file, fileUrl).catch(() => { return response(res, parseError(), {}); });
            });
            let user = new User({});
            user.update(userId, { carrierDocuments: fileUrls }).then(userRes => {
                return response(res, parseError('-'), {});
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError(), {});
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
            if (!userId) return response(res, parseError('userId'), {});
            let data = req.body;
            data["userId"] = userId;
            let load = new Load(data);
            load.save().then(() => {
                return response(res, parseError('-'), {});
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError(), {});
        }
    }
    async getUserLoads(req, res) {
        try {
            console.log("getUserLoads");
            let { userId } = req.query;
            if (!userId) return response(res, parseError('userId'), {});
            let load = new Load({});
            load.getAllUserLoads(userId).then((loadRes) => {
                return response(res, parseError('-'), loadRes);
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError(), {});
        }
    }
    async getLoadDetail(req, res) {
        try {
            console.log("getLoadDetail");
            let { loadId } = req.query;
            if (!loadId) return response(res, parseError('loadId'), {});
            let load = new Load({});
            load.getLoad(loadId).then((loadRes) => {
                return response(res, parseError('-'), loadRes);
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError(), {});
        }
    }
    async getSearchTruckers(req, res) {
        try {
            console.log("getSearchTruckers");
            let { address } = req.query;
            if (!address) return response(res, parseError('address'), {});
            let user = new User({});
            user.getAllSearchUsers(address.toLowerCase()).then((usersRes) => {
                return response(res, parseError('-'), usersRes);
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError(), {});
        }
    }
    async getTruckerDetail(req, res) {
        try {
            console.log("getTruckerDetail");
            let { truckUserId } = req.query;
            if (!truckUserId) return response(res, parseError('truckUserId'), {});
            let user = new User({});
            user.getSingleUser(truckUserId).then((usersRes) => {
                return response(res, parseError('-'), usersRes);
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError(), {});
        }
    }
    async saveTruckerRating(req, res) {
        try {
            console.log("saveTruckerRating");
            let { loadId } = req.query;
            let { rating } = req.body;
            if (!loadId) return response(res, parseError('loadId'), {});
            if (!rating) return response(res, parseError('rating'), {});
            let load = new Load({});
            load.saveTruckerRating(loadId, rating).then((usersRes) => {
                return response(res, parseError('-'), {});
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError(), {});
        }
    }
    async getTruckerRatings(req, res) {
        try {
            console.log("getTruckerRatings");
            let { truckUserId } = req.query;
            if (!truckUserId) return response(res, parseError('truckUserId'), {});
            let load = new Load({});
            load.getAllTruckerLoads(truckUserId).then((loadRes) => {
                loadRes = loadRes.map((load) => ({
                    loadId: load.id,
                    truckUserId: load.data.truckUserId,
                    userId: load.data.userId,
                    ...load.data.rating
                }));
                return response(res, parseError('-'), loadRes);
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError(), {});
        }
    }
    async saveFavTruckerProfile(req, res) {
        try {
            console.log("saveFavTruckerProfile");
            let { userId } = req.query;
            if (!userId) return response(res, parseError('userId'), {});
            let { favTruckUserIds } = req.body;
            if (!favTruckUserIds) return response(res, parseError('favTruckUserIds'), {});
            let user = new User({});
            user.update(userId, { favTruckUserIds }).then((usersRes) => {
                return response(res, parseError('-'), {});
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError(), {});
        }
    }
    async getFavTruckerProfiles(req, res) {
        try {
            console.log("getFavTruckerProfiles");
            let { userId } = req.query;
            if (!userId) return response(res, parseError('userId'), {});
            let user = new User({});
            user.getSingleUser(userId).then((usersRes) => {
                return response(res, parseError('-'), { favTruckUserIds: usersRes.favTruckUserIds });
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError(), {});
        }
    }
    //Controller as Trucker
    async getSearchLoads(req, res) {
        try {
            console.log("getSearchLoads");
            let { shippingItem } = req.query;
            if (!shippingItem) return response(res, parseError('shippingItem'), {});
            let load = new Load({});
            load.getAllSearchLoads(parseInt(shippingItem)).then((loadRes) => {
                return response(res, parseError('-'), loadRes);
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError(), {});
        }
    }
    async saveLoadBook(req, res) {
        try {
            console.log("saveLoadBook");
            let { loadId } = req.query;
            let { truckUserId } = req.body;
            if (!loadId) return response(res, parseError('loadId'), {});
            if (!truckUserId) return response(res, parseError('truckUserId'), {});
            let load = new Load({});
            load.update(loadId, { truckUserId }).then(() => {
                return response(res, parseError('-'), {});
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError(), {});
        }
    }
    async updateLoadStatus(req, res) {
        try {
            console.log("updateLoadStatus");
            let { loadId } = req.query;
            if (!loadId) return response(res, parseError('loadId'), {});
            let { statusShipping } = req.body;
            if (!statusShipping) return response(res, parseError('statusShipping'), {});
            let load = new Load({});
            load.update(loadId, { statusShipping }).then(() => {
                return response(res, parseError('-'), {});
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError(), {});
        }
    }
    async getUserDetail(req, res) {
        try {
            console.log("getUserDetail");
            let { userId } = req.query;
            if (!userId) return response(res, parseError('userId'), {});
            let user = new User({});
            user.getSingleUser(userId).then((usersRes) => {
                return response(res, parseError('-'), usersRes);
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError(), {});
        }
    }
    async saveUserRating(req, res) {
        try {
            console.log("saveUserRating");
            let { loadId } = req.query;
            let { rating } = req.body;
            if (!loadId) return response(res, parseError('loadId'), {});
            if (!rating) return response(res, parseError('rating'), {});
            let load = new Load({});
            load.saveUserRating(loadId, rating).then((usersRes) => {
                return response(res, parseError('-'), {});
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError(), {});
        }
    }
    async getUserRatings(req, res) {
        try {
            console.log("getUserRatings");
            let { userId } = req.query;
            if (!userId) return response(res, parseError('userId'), {});
            let load = new Load({});
            load.getAllUserLoads(userId).then((loadRes) => {
                loadRes = loadRes.map((load) => ({
                    loadId: load.id,
                    truckUserId: load.data.truckUserId,
                    userId: load.data.userId,
                    ...load.data.rating
                }));
                return response(res, parseError('-'), loadRes);
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError(), {});
        }
    }
    async getTruckerLoads(req, res) {
        try {
            console.log("getTruckerLoads");
            let { truckUserId } = req.query;
            if (!truckUserId) return response(res, parseError('truckUserId'), {});
            let load = new Load({});
            load.getAllTruckerLoads(truckUserId).then((loadRes) => {
                return response(res, parseError('-'), loadRes);
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError(), {});
        }
    }
    async saveFavLoad(req, res) {
        try {
            console.log("saveFavLoad");
            let { truckUserId } = req.query;
            let { favLoadIds } = req.body;
            if (!truckUserId) return response(res, parseError('truckUserId'), {});
            if (!favLoadIds) return response(res, parseError('favLoadIds'), {});
            let user = new User({});
            user.update(truckUserId, { "truck.favLoadIds": favLoadIds }).then((usersRes) => {
                return response(res, parseError('-'), {});
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError(), {});
        }
    }
    async getFavLoads(req, res) {
        try {
            console.log("getFavLoads");
            let { truckUserId } = req.query;
            if (!truckUserId) return response(res, parseError('truckUserId'), {});
            let user = new User({});
            user.getSingleUser(truckUserId).then((usersRes) => {
                return response(res, parseError('-'), usersRes.truck ? { favLoadIds: usersRes.truck.favLoadIds } : {});
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError(), {});
        }
    }
}
module.exports = new UserController();