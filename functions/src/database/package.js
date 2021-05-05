const firebaseFirestore = require("../services/firebase-firestore");

class Package {
    constructor({
        name = "",
        description = "",
        amount = "",
        amount_duration = "",
        is_default = "",
        createdAt = "",
        updatedAt = ""
    }) {
        this.collection = 'packages';
        this.name = name;
        this.description = description;
        this.amount = amount;
        this.amount_duration = amount_duration;
        this.is_default = is_default;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    async save() {
        const result = await firebaseFirestore.addData(this.collection, {
            name = this.name,
            description = this.description,
            amount = this.amount,
            amount_duration = this.amount_duration,
            is_default = this.is_default,
            createdAt = this.createdAt,
            updatedAt = this.updatedAt
        }).catch((error) => {
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