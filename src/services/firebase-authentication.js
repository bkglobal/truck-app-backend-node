const admin = require('firebase-admin');

class FirebaseAuthentication { 
    async createUser({email, password}) {
        return new Promise(async (resolve, reject) => {
            const userResult  = await admin.auth().createUser({email, password}).catch(reject);  
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