const firebaseFirestore = require("../services/firebase-firestore");

class Load {
    constructor({
        userId = "",
        truckUserId = "",
        loadItemName = "",
        skidCount = 0,
        weight = 0,
        pickupAddress = "",
        dropOffAddress = "",
        dateTime = "",
        priceRange = 0,
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
        this.statusShipping = statusShipping;//NEW/BOOKED/DESTINATION/DELIVERED/COMPLETED
        this.createdAt = firebaseFirestore.getServerTimeStamp();
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
            rating: {
                truckerRating: 0,
                userRating: 0
            },
            createdAt: this.createdAt
        }).catch(error => { throw error });
        return result;
    }
    async update(id, data) {
        const result = await firebaseFirestore.updateData(this.collection, id, data).catch(error => { throw error });
        return result;
    }
    async getLoad(id) {
        const result = await firebaseFirestore.getSingleData(this.collection, id).catch(error => { throw error });
        return result;
    }
    async getAllUserLoads(userId) {
        const result = await firebaseFirestore.getAllData(this.collection, [["userId", "==", userId]]).catch(error => { throw error });
        return result;
    }
    async getAllTruckerLoads(truckUserId) {
        const result = await firebaseFirestore.getAllData(this.collection, [["truckUserId", "==", truckUserId]]).catch(error => { throw error });
        return result;
    }
    async getAllSearchLoads(skidCount) {
        const result = await firebaseFirestore.getAllData(this.collection, [["skidCount", "==", skidCount]]).catch(error => { throw error });
        return result;
    }
    async saveTruckerRating(id, rating) {
        const result = await firebaseFirestore.updateData(this.collection, id, { "rating.truckerRating": rating }).catch(error => { throw error });
        return result;
    }
    async saveUserRating(id, rating) {
        const result = await firebaseFirestore.updateData(this.collection, id, { "rating.userRating": rating }).catch(error => { throw error });
        return result;
    }
    async getAllLoads() {
        const result = await firebaseFirestore.getAllData(this.collection).catch(error => { throw error });
        return result;
    }
    async getAllCompletedLoads() {
        const result = await firebaseFirestore.getAllData(this.collection, [["statusShipping", "==", "COMPLETED"]]).catch(error => { throw error });
        return result;
    }
    async getAllUsersInDateRange(startDate, endDate) {
        const result = await firebaseFirestore.getAllData(this.collection, [["createdAt",">=", new Date(startDate)],["createdAt","<=", new Date(endDate)]]).catch(error => { throw error });
        return result;
    }
}

module.exports = Load;