const firebaseFirestore = require("../services/firebase-firestore");

class Load {
    constructor({
        userId = null,
        truckUserId = null,
        loadItemName = null,
        skidCount = null,
        weight = null,
        pickupAddress = null,
        dropOffAddress = null,
        dateTime = null,
        priceRange = null,
        statusShipping = "NEW"
    }) {
        this.collection = 'Loads';
        this.userId = userId;
        this.truckUserId = truckUserId;
        this.loadItemName = loadItemName;
        this.skidCount = skidCount;
        this.weight = weight;
        this.pickupAddress = pickupAddress;
        this.dropOffAddress = dropOffAddress;
        this.dateTime = dateTime;
        this.priceRange = priceRange;
        this.statusShipping = statusShipping;
        this.createdAt = new Date().toLocaleString();
    }
    async save() {
        const result = await firebaseFirestore.addData(this.collection, {
            userId: this.userId,
            truckUserId: this.truckUserId,
            loadItemName: this.loadItemName,
            skidCount: this.skidCount,
            weight: this.weight,
            pickupAddress: this.pickupAddress,
            dropOffAddress: this.dropOffAddress,
            dateTime: this.dateTime,
            priceRange: this.priceRange,
            statusShipping: this.statusShipping,
            createdAt: this.createdAt
        }).catch((error) => {
            return error;
        });
        return result;
    }
    async getLoad(id){
        const result = await firebaseFirestore.getSingleData(this.collection, id).catch((error) => {
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

module.exports = Load;