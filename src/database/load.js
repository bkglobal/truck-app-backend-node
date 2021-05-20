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
    async getMultipleLoads(ids) {
        const result = await firebaseFirestore.getMultipleData(this.collection, ids).catch(error => { throw error });
        return result;
    }
    async getUserLoads(userId, { hasOwnTruck }, isCompleted) {
        let clauses = [[hasOwnTruck ? "truckUserId" : "userId", "==", userId]];
        if (isCompleted) clauses.push(["statusShipping", "==", "COMPLETED"]);
        //else clauses.push(["statusShipping", "!=", "COMPLETED"]);
        let result = await firebaseFirestore.getAllData(this.collection, clauses).catch(error => { throw error });
        if (!isCompleted) result = result.filter((doc) => doc.statusShipping != "COMPLETED");
        return result;
    }
    async getSearchNewLoads() {
        const result = await firebaseFirestore.getAllData(this.collection, [["statusShipping", "==", "NEW"]], [["createdAt", "desc"]]).catch(error => { throw error });
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
        startDate = new Date(startDate);
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        endDate = new Date(endDate);
        endDate.setHours(0);
        endDate.setMinutes(0);
        endDate.setSeconds(0);
        const result = await firebaseFirestore.getAllData(this.collection, [["createdAt", ">=", new Date(startDate)], ["createdAt", "<=", new Date(endDate)]]).catch(error => { throw error });
        return result;
    }
    async deleteLoad(id) {
        const result = await firebaseFirestore.deleteDoc(this.collection, id).catch(error => { throw error });
        return result;
    }
}

module.exports = Load;