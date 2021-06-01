const firebaseFirestore = require("../services/firebase-firestore");

class Package {
    constructor({
        name = "",
        description = "",
        amount = 0,
        validPeriodMonths = 0
    }) {
        this.collection = 'Packages';
        this.fields = {
            name: name,
            description: description,
            amount: amount,
            validPeriodMonths: validPeriodMonths
        }
        this.createdAt = firebaseFirestore.getServerTimeStamp();
    }

    async save() {
        const result = await firebaseFirestore.addData(this.collection, {
            ...this.fields,
            createdAt: this.createdAt
        }).catch((error) => {
            return error;
        });
        return result;
    }
    async get(id) {
        const result = await firebaseFirestore.getSingleData(this.collection, id).catch((error) => {
            return error;
        });
        return result;
    }
    async update(id, obj) {
        let data = {};
        if (obj.name) data.name = obj.name;
        if (obj.description) data.description = obj.description;
        if (obj.amount) data.amount = obj.amount;
        if (obj.validPeriodMonths) data.validPeriodMonths = obj.validPeriodMonths;
        const result = await firebaseFirestore.updateData(this.collection, id, data).catch((error) => {
            return error;
        });
        return result;
    }
    async getAll() {
        const result = await firebaseFirestore.getAllData(this.collection).catch((error) => {
            return error;
        });
        return result;
    }
    async delete(id) {
        const result = await firebaseFirestore.deleteDoc(this.collection, id).catch((error) => {
            return error;
        });
        return result;
    }
}

module.exports = Package;