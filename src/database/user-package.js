const firebaseFirestore = require("../services/firebase-firestore");

class Package {
    constructor({
        packageId = "",
        userId = "",
        validPeriodMonths = 0
    }) {
        this.collection = 'UserPackages';
        this.fields = {
            packageId: packageId,
            userId: userId,
            startDate: new Date().toISOString(),
            validPeriodMonths: validPeriodMonths,
            status: 1//1:PENDING, 2:ACTIVE, 3:EXPIRED
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
        if (obj.status) data.status = obj.status;
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
}

module.exports = Package;