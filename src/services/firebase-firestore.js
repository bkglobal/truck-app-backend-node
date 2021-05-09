const admin = require('firebase-admin');

const db = admin.firestore();

class FirebaseFirestore {
    async addData(collection, data, id) {
        return new Promise(async (resolve, reject) => {
            let ref;
            if (id) {
                ref = db.collection(collection).doc(id).set(data);
            } else {
                ref = db.collection(collection).add(data);
            }
            const result = await ref.catch(reject);
            //console.log(result);
            resolve(result);
        })
    }
    async updateData(collection, id, data) {
        return new Promise(async (resolve, reject) => {
            const result = await db.collection(collection).doc(id).update(data).catch(reject);
            resolve(result);
        })
    }
    async getSingleData(collection, id) {
        return new Promise(async (resolve, reject) => {
            const doc = await db.collection(collection).doc(id).get().catch(reject);
            if (doc.exists) resolve(doc.data());
            resolve({});
        });
    }
    async getAllData(collection) {
        return new Promise(async (resolve, reject) => {
            const result = await db.collection(collection).get().catch(reject);
            resolve(result.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
    }
    async getAllDataWithCriteria(collection, arrWhereClauses) {
        return new Promise(async (resolve, reject) => {
            let query = db.collection(collection);
            arrWhereClauses.forEach((clause) => { query = query.where(...clause) });
            const result = await query.get().catch(reject);
            resolve(result.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
    }
}

module.exports = new FirebaseFirestore();