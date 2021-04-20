const { request, response } = require("express");
const User = require("../../database/user");
const firebaseAuthentication = require("../../services/firebase-authentication");

class UserController {
    /**
     * @param {request} req The date
     * @param {response} res The string
    */
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

    /**
     * @param {request} req The date
     * @param {response} res The string
    */
    async singup(req, res) {
        try {
            const { email, password, name } = req.body;
            firebaseAuthentication.createUser({email, password}).then(result => {
                let user = new User({ email, name });
                user.save().then(userRes => {
                    console.log(userRes);
                    return res.status(200).send(result);
                }).catch(error => {
                    console.log(error);
                    return res.status(500).send({error});
                });
            });
        } catch (error) {
            return res.status(400).send({ error });
        }
    }

    /**
     * @param {request} req The date
     * @param {response} res The string
    */
    async login(req, res) {
        try {
            const { email, password } = req.body;
            firebaseAuthentication.createUser({ email, password }).then(result => {
                console.log(result);
                return res.status(200).send(result);
            })
        } catch (error) {
            return res.status(400).send({ error });
        }
    }

}

module.exports = new UserController();