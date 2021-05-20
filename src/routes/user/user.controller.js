const User = require("../../database/user");
const Load = require("../../database/load");
const firebaseAuthentication = require("../../services/firebase-authentication");
const { fileUploadPath, uploadFile, parseError, response } = require("../../helper/utils");

// const path = require('path');
// const os = require('os');
// const fs = require('fs');
// const Busboy = require('busboy');

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
                    return response(res, parseError(), { userId: uid });
                }).catch(error => {
                    return response(res, parseError(error.code), {});
                });
            }).catch(error => { return response(res, parseError(error.code), {}); });
        } catch (error) {
            return response(res, parseError('error'), {});
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
                let fileUrl = `${fileUploadPath}/${date.getTime()}-${file.name}`;
                fileUrls.push(fileUrl)
                uploadFile(file, fileUrl).catch(() => { return response(res, parseError('error'), {}); });
            });
            console.log("hi");
            let user = new User({});
            user.update(userId, { carrierDocuments: fileUrls }).then(userRes => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
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
            if(req.user.hasOwnTruck) return response(res, parseError('access-denied'), {});
            let { userId } = req.query;
            if (!userId) return response(res, parseError('userId'), {});
            let data = req.body;
            data["userId"] = userId;
            let load = new Load(data);
            load.save().then(() => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async getUserLoads(req, res) {
        try {
            console.log("getUserLoads");
            let { userId } = req.query;
            if (!userId) return response(res, parseError('userId'), {});
            let load = new Load({});
            load.getUserLoads(userId, req.user).then((loadRes) => {
                return response(res, parseError(), loadRes);
            }).catch(error => {
                console.log(error);
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async getLoadDetail(req, res) {
        try {
            console.log("getLoadDetail");
            let { loadId } = req.query;
            if (!loadId) return response(res, parseError('loadId'), {});
            let load = new Load({});
            load.getLoad(loadId).then((loadRes) => {
                return response(res, parseError(), loadRes);
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async getCompletedUserLoads(req, res) {
        try {
            console.log("getCompletedUserLoads");
            let { userId } = req.query;
            if (!userId) return response(res, parseError('userId'), {});
            let user = await (new User({}).getSingleUser(userId));
            if(Object.keys(user).length === 0) return response(res, parseError('error'), {});
            let load = new Load({});
            load.getUserLoads(userId, user.hasOwnTruck, true).then((loadRes) => {
                return response(res, parseError(), loadRes);
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async deleteLoad(req, res) {
        try {
            console.log("deleteLoad");
            let { loadId } = req.query;
            if (!loadId) return response(res, parseError('loadId'), {});
            let load = new Load({});
            load.deleteLoad(loadId).then((loadRes) => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async getSearchTruckers(req, res) {
        try {
            console.log("getSearchTruckers");
            let user = new User({});
            user.getAllTruckUsers().then((usersRes) => {
                return response(res, parseError(), usersRes);
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    // async getTruckerDetail(req, res) {
    //     try {
    //         console.log("getTruckerDetail");
    //         let { truckUserId } = req.query;
    //         if (!truckUserId) return response(res, parseError('truckUserId'), {});
    //         let user = new User({});
    //         user.getSingleUser(truckUserId).then((usersRes) => {
    //             return response(res, parseError(), usersRes);
    //         }).catch(error => {
    //             return response(res, parseError(error.code), {});
    //         });
    //     } catch (error) {
    //         return response(res, parseError('error'), {});
    //     }
    // }
    async saveTruckerRating(req, res) {
        try {
            console.log("saveTruckerRating");
            let { loadId } = req.query;
            let { rating } = req.body;
            if (!loadId) return response(res, parseError('loadId'), {});
            if (!rating) return response(res, parseError('rating'), {});
            let load = new Load({});
            load.saveTruckerRating(loadId, rating).then((usersRes) => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
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
                return response(res, parseError(), loadRes);
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
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
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async getFavTruckerProfiles(req, res) {
        try {
            console.log("getFavTruckerProfiles");
            let { userId } = req.query;
            if (!userId) return response(res, parseError('userId'), {});
            let user = new User({});
            user.getMultipleUsers(req.user.favTruckUserIds).then((usersRes) => {
                return response(res, parseError(), usersRes);
            }).catch(error => {
                console.log(error);
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            console.log(error);

            return response(res, parseError('error'), {});
        }
    }
    //Controller as Trucker
    async getSearchNewLoads(req, res) {
        try {
            console.log("getSearchNewLoads");
            let load = new Load({});
            load.getSearchNewLoads().then((loadRes) => {
                return response(res, parseError(), loadRes);
            }).catch(error => {
                console.log(error);
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
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
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
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
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async getUserDetail(req, res) {
        try {
            console.log("getUserDetail");
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
    async saveUserRating(req, res) {
        try {
            console.log("saveUserRating");
            let { loadId } = req.query;
            let { rating } = req.body;
            if (!loadId) return response(res, parseError('loadId'), {});
            if (!rating) return response(res, parseError('rating'), {});
            let load = new Load({});
            load.saveUserRating(loadId, rating).then((usersRes) => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async getUserRatings(req, res) {
        try {
            console.log("getUserRatings");
            let { userId } = req.query;
            if (!userId) return response(res, parseError('userId'), {});
            let load = new Load({});
            load.getUserLoads(userId).then((loadRes) => {
                loadRes = loadRes.map((load) => ({
                    loadId: load.id,
                    truckUserId: load.data.truckUserId,
                    userId: load.data.userId,
                    ...load.data.rating
                }));
                return response(res, parseError(), loadRes);
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async getTruckerLoads(req, res) {
        try {
            console.log("getTruckerLoads");
            let { truckUserId } = req.query;
            if (!truckUserId) return response(res, parseError('truckUserId'), {});
            let load = new Load({});
            load.getAllTruckerLoads(truckUserId).then((loadRes) => {
                return response(res, parseError(), loadRes);
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
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
            user.update(truckUserId, { truck: { favLoadIds: favLoadIds } }).then((usersRes) => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async getFavLoads(req, res) {
        try {
            console.log("getFavLoads");
            let { truckUserId } = req.query;
            if (!truckUserId) return response(res, parseError('truckUserId'), {});
            let user = new User({});
            req.user = await user.getSingleUser(truckUserId);
            user.getSingleUser(truckUserId).then((usersRes) => {
                return response(res, parseError(), usersRes.truck ? { favLoadIds: usersRes.truck.favLoadIds } : {});
            }).catch(error => {
                return response(res, parseError(error.code), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
}
module.exports = new UserController();