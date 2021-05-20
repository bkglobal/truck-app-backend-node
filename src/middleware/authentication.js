const User = require("../database/user");
const firebaseAuthentication = require("../services/firebase-authentication")
const { parseError, response } = require("../helper/utils");
module.exports = {
    isAuthenticated: (req, res, next) => {
        let token = req.headers.authorization || '';
        if (!token) return res.status(403).send('Token Required!');
        firebaseAuthentication.isAuthenticated(token).then(() => {
            return next();
        }).catch(error => {
            return res.status(403).send('Unauthorized');
        })
    },
    fetchUser: (req, res, next) => {
        let { userId } = req.query;
        if (!userId) return response(res, parseError('userId'), {});
        let user = new User({});
        user.getSingleUser(userId).then((user)=>{
            if(!user) return response(res, parseError('unAuth'), {});
            req.user = user;
            return next();
        }).catch((error) => {
            return response(res, parseError('unAuth'), {});
        });
    }
}