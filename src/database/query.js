const firebaseFirestore = require("../services/firebase-firestore");
const { StatusQuery } = require("../helper/constants");
class Query {
    constructor({
        userId = "",
        title = "",
        query = "",
        queryReply = "",
        status = 1
    }) {
        this.collection = 'Queries';
        this.fields = {
            userId: userId,
            title: title,
            query: query,
            queryReply: queryReply,
            status: status
        }
        this.createdAt = firebaseFirestore.getServerTimeStamp();
    }

    async save() {
        const result = await firebaseFirestore.addData(this.collection, {
            ...this.fields,
            createdAt: this.createdAt
        }).catch((error) => { throw error; });
        return result;
    }
    async get(id) {
        const result = await firebaseFirestore.getSingleData(this.collection, id).catch((error) => { throw error; });
        return result;
    }
    async getAllUserQueries(userId) {
        const result = await firebaseFirestore.getAllData(this.collection, [["userId", "==", userId]], [["createdAt", "desc"]]).catch((error) => { throw error; });
        return result;
    }
    async getAllUsersQueries() {
        const result = await firebaseFirestore.getAllData(this.collection, [["status", "==", StatusQuery.PENDING]], [["createdAt", "desc"]]).catch((error) => { throw error; });
        return result;
    }
    async updateUserQueryReply(queryId, obj) {
        let data = {};
        if (obj.queryReply) {
            data.queryReply = obj.queryReply;
            data.status = StatusQuery.RESOLVED;
        }
        const result = await firebaseFirestore.updateData(this.collection, queryId, data).catch((error) => { throw error; });
        return result;
    }
    async delete(id) {
        const result = await firebaseFirestore.deleteDoc(this.collection, id).catch((error) => { throw error; });
        return result;
    }
}

module.exports = Query;