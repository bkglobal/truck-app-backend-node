const admin = require('./firebase-init');

class FirebaseAuthentication {
    async createUser({ email, password }) {
        return new Promise(async (resolve, reject) => {
            const userResult = await admin.auth().createUser({ email, password }).catch(reject);
            resolve(userResult);
        })
    }
    async deleteUser(uid) {
        return new Promise(async (resolve, reject) => {
            const userResult = await admin.auth().deleteUser(uid).catch(reject);
            resolve(userResult);
        })
    }
    async isAuthenticated(token) {
        return new Promise(async (resolve, reject) => {
            const auth = await admin.auth().verifyIdToken(token).catch(reject);
            resolve(auth);
        });
    }
}

module.exports = new FirebaseAuthentication();