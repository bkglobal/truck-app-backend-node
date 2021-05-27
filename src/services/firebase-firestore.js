const admin = require('firebase-admin');
const db = require('./firebase-init').firestore();

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
            resolve(doc.exists && doc.data());
        });
    }
    async getMultipleData(collection, ids = []) {
        const promises = [];
        ids.forEach(id => promises.push(db.collection(collection).doc(id).get()))
        return new Promise(async (resolve, reject) => {
            let result = await Promise.all(promises).catch(error => reject(error));
            resolve(result.map(doc => ({ id: doc.id, ...doc.data() })));
        });
    }
    async getAllData(collection, arrWhereClauses = [], arrOrderClauses = []) {
        return new Promise(async (resolve, reject) => {
            try {
                let query = db.collection(collection);
                arrWhereClauses.forEach((clause) => { query = query.where(...clause) });
                arrOrderClauses.forEach((clause) => { query = query.orderBy(...clause) });
                const result = await query.get().catch(error => reject(error));
                resolve(result.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                reject(error);
            }
        });
    }
    async getAllDataLength(collection, arrWhereClauses = [], arrOrderClauses = []) {
        return new Promise(async (resolve, reject) => {
            try {
                let query = db.collection(collection);
                arrWhereClauses.forEach((clause) => { query = query.where(...clause) });
                arrOrderClauses.forEach((clause) => { query = query.orderBy(...clause) });
                const result = await query.get().catch(error => reject(error));
                resolve(result.docs.length);
            } catch (error) {
                reject(error);
            }
        });
    }
    async getPaginatedData(collection, arrWhereClauses = [], arrOrderClauses = [], pageSize, docIdStartAfter) {
        return new Promise(async (resolve, reject) => {
            try {
                let query = db.collection(collection);
                arrWhereClauses.forEach((clause) => { query = query.where(...clause) });
                arrOrderClauses.forEach((clause) => { query = query.orderBy(...clause) });
                if (docIdStartAfter) {
                    let doc = await db.collection(collection).doc(docIdStartAfter).get();
                    query = query.startAfter(doc);
                }
                const result = await query.limit(pageSize ? pageSize : 10).get().catch(error => reject(error));
                resolve(result.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                reject(error);
            }
        });
    }
    async deleteDoc(collection, id) {
        return new Promise(async (resolve, reject) => {
            const doc = await db.collection(collection).doc(id).delete().catch(reject);
            resolve(doc);
        });
    }
}

module.exports = new FirebaseFirestore();