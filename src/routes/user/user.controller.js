const User = require("../../database/user");
const Load = require("../../database/load");
const Query = require("../../database/query");
const FreePlan = require("../../database/free-plan");
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
                //setting load limits for the user
                let freePlan = await (new FreePlan({}).getPlan());
                if (data.truck) data.truck.loadLimit = freePlan.truckerLoadLimit;
                else data.loadLimit = freePlan.userLoadLimit;
                new User(data).save().then(() => {
                    return response(res, parseError(), { userId: uid });
                }).catch(error => {
                    console.log(error);
                    return response(res, parseError(error.code || "error"), {});
                });
            }).catch(error => { console.log(error);return response(res, parseError(error.code || "error"), {}); });
        } catch (error) {
            console.log(error);
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
            new User({}).update(userId, { carrierDocuments: fileUrls }).then(() => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    //Notification
    async sendNotification(req, res) {
        try {
            console.log("sendNotification");
            let { token, notification } = req.body;
            if (!token || !notification || !notification.title || !notification.body) return response(res, parseError('error'), {});
            new User({}).sendNotification(token, notification.title, notification.body).then(() => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
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
    //Queries
    async saveUserQuery(req, res) {
        try {
            console.log("saveUserQuery");
            new Query(req.body).save().then(() => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async getUserQueries(req, res) {
        try {
            console.log("getUserQueries");
            let { userId } = req.query;
            if (!userId) return response(res, parseError('userId'), {});
            new Query({}).getAllUserQueries(userId).then((result) => {
                return response(res, parseError(), result);
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async getQuery(req, res) {
        try {
            console.log("getQuery");
            let { queryId } = req.query;
            if (!queryId) return response(res, parseError('userId'), {});
            new Query({}).get(queryId).then((result) => {
                return response(res, parseError(), result);
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async deleteQuery(req, res) {
        try {
            console.log("deleteQuery");
            let { queryId } = req.query;
            if (!queryId) return response(res, parseError('userId'), {});
            new Query({}).delete(queryId).then(() => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async getUsersQueries(req, res) {
        try {
            console.log("getUsersQueries");
            new Query({}).getAllUsersQueries().then((result) => {
                return response(res, parseError(), result);
            }).catch(error => {
                console.log(error);
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            console.log(error);
            return response(res, CODES.Bad_Request, { error });
        }
    }
    async updateUserQueryReply(req, res) {
        try {
            console.log("updateUserQueryReply");
            let { queryId } = req.query;
            if (!queryId) return response(res, parseError('queryId'), {});
            new Query({}).updateUserQueryReply(queryId, req.body).then(() => {
                return response(res, parseError(), {});
            }).catch(error => {
                console.log(error);
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            console.log(error);
            return response(res, CODES.Bad_Request, { error });
        }
    }
    //Controller as User
    async updateUser(req, res) {
        try {
            console.log("updateUser");
            let { userId } = req.query;
            if (!userId) return response(res, parseError('userId'), {});
            new User({}).update(userId, req.body).then(() => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async saveUserFcmToken(req, res) {
        try {
            console.log("saveUserFcmToken");
            if (req.user.hasOwnTruck) return response(res, parseError('access-denied'), {});
            let { userId } = req.query;
            if (!userId) return response(res, parseError('userId'), {});
            let data = req.body;
            data["userId"] = userId;
            new Load(data).save().then(() => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async saveUserLoad(req, res) {
        try {
            console.log("saveUserLoad");
            let { userId } = req.query;
            if (!userId) return response(res, parseError('userId'), {});
            let requestedUser = await (new User({}).getSingleUser(userId));
            if (!requestedUser) return response(res, parseError('unauth'), {});
            if (requestedUser.hasOwnTruck) return response(res, parseError('access-denied'), {});
            if (requestedUser.loadLimit <= 0) return response(res, parseError('load-limit-reached'), {});
            let data = req.body;
            data["userId"] = userId;
            await new User({}).decrementLoadLimit(userId);
            new Load(data).save().then(() => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
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
            let requestedUser = await (new User({}).getSingleUser(userId));
            if (!requestedUser) return response(res, parseError('unauth'), {});
            new Load({}).getAllUserLoads(userId, requestedUser).then((result) => {
                return response(res, parseError(), result);
            }).catch(error => {
                console.log(error);
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async getCompletedUserLoads(req, res) {
        try {
            console.log("getCompletedUserLoads");
            let { userId, pageSize, idStartAfter } = req.query;
            if (!userId) return response(res, parseError('userId'), {});
            let requestedUser = await (new User({}).getSingleUser(userId));
            if (!requestedUser) return response(res, parseError('unauth'), {});
            new Load({}).getCompletedUserLoads(userId, requestedUser, parseInt(pageSize), idStartAfter).then((result) => {
                return response(res, parseError(), result);
            }).catch(error => {
                console.log(error);
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async getInProgressUserLoads(req, res) {
        try {
            console.log("getInProgressUserLoads");
            let { userId, pageSize, idStartAfter } = req.query;
            if (!userId) return response(res, parseError('userId'), {});
            let requestedUser = await (new User({}).getSingleUser(userId));
            if (!requestedUser) return response(res, parseError('unauth'), {});
            new Load({}).getInProgressUserLoads(userId, requestedUser, parseInt(pageSize), idStartAfter).then((result) => {
                return response(res, parseError(), result);
            }).catch(error => {
                console.log(error);
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async getLoadDetail(req, res) {
        try {
            console.log("getLoadDetail");
            let { loadId, userId } = req.query;
            if (!loadId) return response(res, parseError('loadId'), {});
            if (!userId) return response(res, parseError('userId'), {});
            let requestedUser = await (new User({}).getSingleUser(userId));
            if (!requestedUser) return response(res, parseError('unauth'), {});
            new Load({}).getLoad(loadId, requestedUser).then((result) => {
                return response(res, parseError(), result);
            }).catch(error => {
                console.log(error);
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            console.log(error);
            return response(res, parseError('error'), {});
        }
    }
    async getUserLoadSummary(req, res) {
        try {
            console.log("getUserLoadSummary");
            let { userId } = req.query;
            if (!userId) return response(res, parseError('userId'), {});
            new Load({}).getUserLoadSummary(userId).then((result) => {
                return response(res, parseError(), result);
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            console.log(error);
            return response(res, parseError('error'), {});
        }
    }
    async deleteLoad(req, res) {
        try {
            console.log("deleteLoad");
            let { loadId } = req.query;
            if (!loadId) return response(res, parseError('loadId'), {});
            new Load({}).deleteLoad(loadId).then(() => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async getSearchTruckers(req, res) {
        try {
            console.log("getSearchTruckers");
            let { userId, pageSize, idStartAfter } = req.query;
            if (!userId) return response(res, parseError('userId'), {});
            let requestedUser = await (new User({}).getSingleUser(userId));
            if (!requestedUser) return response(res, parseError('unauth'), {});
            new User({}).getAllTruckUsers(requestedUser, parseInt(pageSize), idStartAfter, req.body).then((result) => {
                return response(res, parseError(), result);
            }).catch(error => {
                console.log(error);
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            console.log(error);
            return response(res, parseError('error'), {});
        }
    }
    async getSearchTruckersByName(req, res) {
        try {
            console.log("getSearchTruckersByName");
            let { userId, pageSize, idStartAfter } = req.query;
            if (!userId) return response(res, parseError('userId'), {});
            let requestedUser = await (new User({}).getSingleUser(userId));
            if (!requestedUser) return response(res, parseError('unauth'), {});
            new User({}).getAllTruckUsersByName(requestedUser, parseInt(pageSize), idStartAfter, req.body).then((result) => {
                return response(res, parseError(), result);
            }).catch(error => {
                console.log(error);
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            console.log(error);
            return response(res, parseError('error'), {});
        }
    }
    async saveTruckerRating(req, res) {
        try {
            console.log("saveTruckerRating");
            let { loadId } = req.query;
            let { rating } = req.body;
            if (!loadId) return response(res, parseError('loadId'), {});
            if (!rating) return response(res, parseError('rating'), {});
            new Load({}).saveTruckerRating(loadId, rating).then(() => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
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
            new Load({}).getAllTruckerLoads(truckUserId).then((result) => {
                result = result.map((load) => ({
                    loadId: load.id,
                    truckUserId: load.data.truckUserId,
                    userId: load.data.userId,
                    ...load.data.rating
                }));
                return response(res, parseError(), result);
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
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
            let { favTruckUserId, isFavorite } = req.body;
            if (!favTruckUserId) return response(res, parseError('favTruckUserId'), {});
            new User({}).saveFavTruckerProfile(userId, { favTruckUserId, isFavorite }).then(() => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
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
            let requestedUser = await (new User({}).getSingleUser(userId));
            if (!requestedUser) return response(res, parseError('unauth'), {});
            new User({}).getMultipleUsers(requestedUser.favTruckUserIds).then((result) => {
                return response(res, parseError(), result);
            }).catch(error => {
                console.log(error);
                return response(res, parseError(error.code || "error"), {});
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
            let { pageSize, idStartAfter } = req.query;
            new Load({}).getSearchNewLoads(parseInt(pageSize), idStartAfter, req.body).then((result) => {
                return response(res, parseError(), result);
            }).catch(error => {
                console.log(error);
                return response(res, parseError(error.code || 'error'), {});
            });
        } catch (error) {
            console.log(error);
            return response(res, parseError('error'), {});
        }
    }
    async getSearchNewLoadsByName(req, res) {
        try {
            console.log("getSearchNewLoadsByName");
            let { pageSize, idStartAfter } = req.query;
            new Load({}).getSearchNewLoadsByName(parseInt(pageSize), idStartAfter, req.body).then((result) => {
                return response(res, parseError(), result);
            }).catch(error => {
                console.log(error);
                return response(res, parseError(error.code || 'error'), {});
            });
        } catch (error) {
            console.log(error);
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
            let requestedUser = await (new User({}).getSingleUser(truckUserId));
            if (!requestedUser) return response(res, parseError('unauth'), {});
            if (!requestedUser.hasOwnTruck) return response(res, parseError('access-denied'), {});
            if (requestedUser.truck.loadLimit <= 0) return response(res, parseError('load-limit-reached'), {});
            await new User({}).decrementLoadLimitTrucker(truckUserId);
            new Load({}).update(loadId, { truckUserId }).then(() => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
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
            new Load({}).update(loadId, { statusShipping }).then(() => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
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
            new User({}).getSingleUser(userId).then((result) => {
                return response(res, parseError(), result);
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
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
            new Load({}).saveUserRating(loadId, rating).then(() => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
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
            let user = await (new User({}).getSingleUser(userId));
            if (!user) return response(res, parseError('error'), {});
            new Load({}).getAllUserLoads(userId, user).then(({ completed }) => {
                completed = completed.map((load) => ({
                    loadId: load.id,
                    truckUserId: load.truckUserId,
                    userId: load.userId,
                    ...load.rating
                }));
                return response(res, parseError(), completed);
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            console.log(error);
            return response(res, parseError('error'), {});
        }
    }
    async getTruckerLoads(req, res) {
        try {
            console.log("getTruckerLoads");
            let { truckUserId } = req.query;
            if (!truckUserId) return response(res, parseError('truckUserId'), {});
            new Load({}).getAllTruckerLoads(truckUserId).then((result) => {
                return response(res, parseError(), result);
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
    async saveFavLoad(req, res) {
        try {
            console.log("saveFavLoad");
            let { truckUserId } = req.query;
            let { favLoadId, isFavorite } = req.body;
            if (!truckUserId) return response(res, parseError('truckUserId'), {});
            if (!favLoadId) return response(res, parseError('favLoadId'), {});
            new User({}).saveFavLoad(truckUserId, { favLoadId, isFavorite }).then(() => {
                return response(res, parseError(), {});
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
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
            let user = await (new User({}).getSingleUser(truckUserId));
            if (!req.user.hasOwnTruck) return response(res, parseError('access-denied'), {});
            new Load({}).getMultipleLoads(user.truck.favLoadIds).then((result) => {
                return response(res, parseError(), result);
            }).catch(error => {
                return response(res, parseError(error.code || "error"), {});
            });
        } catch (error) {
            return response(res, parseError('error'), {});
        }
    }
}
module.exports = new UserController();