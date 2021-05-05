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
        statusShipping = "NEW",
        shippingItem = null
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
        this.shippingItem = shippingItem;
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
            shippingItem: this.shippingItem,
            rating: {
                truckerRating: null,
                userRating: null
            },
            createdAt: this.createdAt
        }).catch((error) => {
            return error;
        });
        return result;
    }
    async update(id, data) {
        const result = await firebaseFirestore.updateData(this.collection, id, data).catch((error) => {
            return error;
        });
        return result;
    }
    async getLoad(id) {
        const result = await firebaseFirestore.getSingleData(this.collection, id).catch((error) => {
            return error;
        });
        return result;
    }
    async getAllUserLoads(userId) {
        const result = await firebaseFirestore.getAllDataWithCriteria(this.collection, [["userId", "==", userId]]).catch((error) => {
            return error;
        });
        return result;
    }
    async getAllTruckerLoads(truckUserId) {
        const result = await firebaseFirestore.getAllDataWithCriteria(this.collection, [["truckUserId", "==", truckUserId]]).catch((error) => {
            return error;
        });
        return result;
    }
    async getAllSearchLoads(shippingItem) {
        const result = await firebaseFirestore.getAllDataWithCriteria(this.collection, [["shippingItem", "==", shippingItem]]).catch((error) => {
            return error;
        });
        return result;
    }
    async saveTruckerRating(id, rating) {
        const result = await firebaseFirestore.updateData(this.collection, id, { "rating.truckerRating": rating }).catch((error) => {
            return error;
        });
        return result;
    }
    async saveUserRating(id, rating) {
        const result = await firebaseFirestore.updateData(this.collection, id, { "rating.userRating": rating }).catch((error) => {
            return error;
        });
        return result;
    }
}

module.exports = Load;