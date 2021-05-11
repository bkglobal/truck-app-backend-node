const admin = require('firebase-admin');
const db = admin.firestore();

class FirebaseFirestore {
    getServerTimeStamp() {
        return admin.firestore.FieldValue.serverTimestamp();
    }
    async addData(collection, data, id) {
        return new Promise(async (resolve, reject) => {
            let ref;
            if (id) {
                ref = db.collection(collection).doc(id).set(data);
            } else {
                ref = db.collection(collection).add(data);
            }
            const result = await ref.catch(reject);
            resolve(result);
        })
    }
    async updateData(collection, id, data) {
        return new Promise(async (resolve, reject) => {
            try {
                await db.collection(collection).doc(id).update(data).then(result => {
                    resolve(result);
                }).catch((error) => {
                    reject(error);
                });
            }
            catch (error) {
                reject(error);
            }
        })
    }
    async getSingleData(collection, id) {
        return new Promise(async (resolve, reject) => {
            const doc = await db.collection(collection).doc(id).get().catch(reject);
            if (doc.exists) resolve(doc.data());
            resolve({});
        });
    }
    // async getAllData(collection) {
    //     return new Promise(async (resolve, reject) => {
    //         const result = await db.collection(collection).orderBy('createdAt').get().catch(reject);
    //         resolve(result.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    //     });
    // }
    async getAllData(collection, arrWhereClauses = []) {
        return new Promise(async (resolve, reject) => {
            try{
                let query = db.collection(collection);
                arrWhereClauses.forEach((clause) => { query = query.where(...clause) });
                const result = await query.get().catch(error => reject(error));
                resolve(result.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }catch(error){
                reject(error);
            }
        });
    }
}

module.exports = new FirebaseFirestore();