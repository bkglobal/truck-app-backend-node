const firebaseFirestore = require("../services/firebase-firestore");

class Package {
    constructor({
        name = null,
        description = null,
        amount = null,
        validPeriod = null,
        isDefault = null,
    }) {
        this.collection = 'Packages';
        // this.name = name;
        // this.description = description;
        // this.amount = amount;
        // this.validPeriod = validPeriod;
        // this.isDefault = isDefault;
        // this.createdAt = new Date().toLocaleString();
        this.fields = {
            name: name,
            description: description,
            amount: amount,
            validPeriod: validPeriod,
            isDefault: isDefault
        }
        this.createdAt = new Date().toLocaleString();
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
    async update(id) {
        let data = {};
        for (let field in this.fields) {
            if(this.fields[field]) data[field] = this.fields[field];
        }
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