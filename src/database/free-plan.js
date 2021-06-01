const firebaseFirestore = require("../services/firebase-firestore");

class FreePlan {
    constructor({
        name = "",
        userLoadLimit = 0,
        truckerLoadLimit = 0,
        description = ""
    }) {
        this.collection = 'FreePlan';
        this.id = 'plan1'
        this.name = name;
        this.userLoadLimit = userLoadLimit;
        this.truckerLoadLimit = truckerLoadLimit;
        this.description = description;
        this.createdAt = firebaseFirestore.getServerTimeStamp();
    }
    async save() {
        const result = await firebaseFirestore.addData(this.collection, {
            name: this.name,
            userLoadLimit: this.userLoadLimit,
            truckerLoadLimit: this.truckerLoadLimit,
            description: this.description,
            createdAt: this.createdAt
        }, this.id).catch((error) => {
            return error;
        });
        return result;
    }
    async update(data) {
        const result = await firebaseFirestore.updateData(this.collection, this.id, data).catch((error) => {
            return error;
        });
        return result;
    }
    async getPlan() {
        const result = await firebaseFirestore.getSingleData(this.collection, this.id).catch((error) => {
            return error;
        });
        return result;
    }
}

module.exports = FreePlan;