const User = require("../../database/user");
const Truck = require("../../database/truck");
const Load = require("../../database/load");
const firebaseAuthentication = require("../../services/firebase-authentication");
const codes = require("../../helper/status-codes");
const utils = require("../../helper/utils");

function response(res, code, data) {
    res.status(code);
    res.json(data);
    res.end();
}

class UserController {
    async getUsers(req, res) {
        try {
            console.log('getting users');
            const user = new User({});
            user.getAll().then(allUsers => {
                console.log(allUsers);
                return res.status(200).send({ result: allUsers })
            }).catch(error => {
                console.log(error);
                return res.status(400).send({ error });
            });
        } catch (error) {
            console.log(error);
            return res.status(400).send({ error });
        }
    }
    async signup(req, res) {
        try {
            console.log("signup");
            let data = req.body;
            let { email, password, truck } = data;
            if (!email || !password) return response(res, codes.Bad_Request, { error: "email|password required" });
            firebaseAuthentication.createUser({ email, password }).then(async authResult => {
                if (data.truck) {
                    var userTruck = new Truck(data.truck);
                    var truck = await userTruck.save();
                    data["truckId"] = truck.id;
                }
                let user = new User({ uid: authResult.uid, ...data });
                user.save().then(userRes => {
                    return response(res, codes.OK, authResult);
                }).catch(error => {
                    return response(res, codes.Internal_Server_Error, { error });
                });
            }).catch(error => { return response(res, codes.Internal_Server_Error, { error }); });
        } catch (error) {
            return response(res, codes.Bad_Request, { error });
        }
    }
    async uploadCarrierDocument(req, res) {
        try {
            console.log("uploadCarrierDocument");
            let { uid } = req.params;
            let files = req.files && req.files.file;
            if (!files) return response(res, codes.Bad_Request, { error: "invalid request" });
            if (!Array.isArray(files)) files = [files];
            let date = new Date();
            let fileUrls = [];
            files.forEach(file => {
                let fileUrl = `${utils.fileUploadPath}/${date.getTime()}-${file.name}`;
                fileUrls.push(fileUrl)
                utils.uploadFile(file, fileUrl).catch(error => { return response(res, codes.Internal_Server_Error, { error }); });
            });
            let user = new User({});
            user.update(uid, { carrierDocuments: fileUrls }).then(userRes => {
                return response(res, codes.OK, userRes);
            }).catch(error => {
                return response(res, codes.Internal_Server_Error, { error });
            });
        } catch (error) {
            return response(res, codes.Bad_Request, { error });
        }
    }
    async postUserLoad(req, res) {
        try {
            console.log("postUserLoad");
            let { uid } = req.params;
            let data = req.body;
            data["userId"] = uid;
            let load = new Load(data);
            load.save().then((loadRes) => {
                return response(res, codes.OK, loadRes);
            }).catch(error => {
                return response(res, codes.Internal_Server_Error, { error });
            });
        } catch (error) {
            return response(res, codes.Bad_Request, { error });
        }
    }
    async getUserLoad(req, res) {
        try {
            console.log("getUserLoad");
            let { uid, idl } = req.params;
            console.log(idl);
            let load = new Load({});
            load.getLoad(idl).then((loadRes) => {
                return response(res, codes.OK, loadRes);
            }).catch(error => {
                return response(res, codes.Internal_Server_Error, { error });
            });
        } catch (error) {
            return response(res, codes.Bad_Request, { error });
        }
    }
    async getSearchTrucks(req, res) {
        try {
            console.log("getSearchTrucks");
            let { address } = req.query;

            // let load = new Load({});
            // load.getLoad(idl).then((loadRes) => {
            //     return response(res, codes.OK, loadRes);
            // }).catch(error => {
            //     return response(res, codes.Internal_Server_Error, { error });
            // });
        } catch (error) {
            return response(res, codes.Bad_Request, { error });
        }
    }
    async getSearchLoads(req, res) {
        try {
            console.log("getSearchLoads");
            let { uid, idl } = req.params;
            console.log(idl);
            let load = new Load({});
            load.getLoad(idl).then((loadRes) => {
                return response(res, codes.OK, loadRes);
            }).catch(error => {
                return response(res, codes.Internal_Server_Error, { error });
            });
        } catch (error) {
            return response(res, codes.Bad_Request, { error });
        }
    }
}

module.exports = new UserController();