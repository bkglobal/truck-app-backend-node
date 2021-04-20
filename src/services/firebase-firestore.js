const admin = require('firebase-admin');

const db = admin.firestore();

class FirebaseFirestore {
    async addData(collection, data) {
        return new Promise(async (resolve, reject) => {
            const reuslt = await db.collection(collection).add(data).catch(reject);
            console.log(reuslt);
            resolve(reuslt);  
        })   
    }
    async getAllData(collection) {
        return new Promise(async (resolve, reject) => {
            const reuslt = await db.collection(collection).get().catch(reject);
            console.log(reuslt);
            resolve(reuslt.docs.map(doc => ({id: doc.id, data: doc.data()})));  
        });
    }
}

module.exports = new FirebaseFirestore();