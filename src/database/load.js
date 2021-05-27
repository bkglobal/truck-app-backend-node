const firebaseFirestore = require("../services/firebase-firestore");
const { StatusShipping } = require('../helper/constants');
const User = require("./user");

class Load {
    constructor({
        userId = "",
        truckUserId = "",
        loadItemName = "",
        skidCount = 0,
        weight = "",
        pickupAddress = "",
        dropOffAddress = "",
        dateTime = Date.now(),
        priceRange = 0
    }) {
        this.collection = 'Loads';
        this.fields = {
            userId: userId,
            truckUserId: truckUserId,
            loadItemName: loadItemName,
            skidCount: skidCount,
            weight: weight,
            pickupAddress: pickupAddress,
            dropOffAddress: dropOffAddress,
            dateTime: new Date(dateTime).toISOString(),
            priceRange: priceRange,
            statusShipping: StatusShipping.NEW,//1:NEW, 2:BOOKED, 3:DESTINATION, 4:DELIVERED, 5:COMPLETED
            rating: {
                truckerRating: 0,
                userRating: 0
            }
        }
        this.createdAt = firebaseFirestore.getServerTimeStamp();
    }
    async save() {
        const result = await firebaseFirestore.addData(this.collection, {
            ...this.fields,
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
        let postedUser = await new User({}).getSingleUser(result.userId);
        result["postedBy"] = { name: postedUser.name, id: postedUser.uid };
        return result;
    }
    async getMultipleLoads(ids) {
        const result = await firebaseFirestore.getMultipleData(this.collection, ids).catch(error => { throw error });
        return result.map((data) => ({ ...data, isFavorite: true }));
    }
    async getAllUserLoads(userId, { hasOwnTruck }) {
        let clauses = [[hasOwnTruck ? "truckUserId" : "userId", "==", userId]];
        let result = await firebaseFirestore.getAllData(this.collection, clauses).catch(error => { throw error });
        let userLoads = {
            new: [],
            completed: [],
            inprogress: []
        }
        for (let load of result) {
            if (load.statusShipping == StatusShipping.NEW) userLoads.new.push(load);
            else if (load.statusShipping == StatusShipping.COMPLETED) userLoads.completed.push(load);
            else userLoads.inprogress.push(load);
        }
        return userLoads;
    }
    async getCompletedUserLoads(userId, { hasOwnTruck }, pageSize, docStartAfter) {
        let clausesWhere = [[hasOwnTruck ? "truckUserId" : "userId", "==", userId], ["statusShipping", "==", StatusShipping.COMPLETED]];
        let clausesOrderBy = [["createdAt", "desc"]];
        let result = await firebaseFirestore.getPaginatedData(this.collection, clausesWhere, clausesOrderBy, pageSize, docStartAfter).catch(error => { throw error });
        return result;
    }
    async getInProgressUserLoads(userId, { hasOwnTruck }, pageSize, docStartAfter) {
        let clausesWhere = [[hasOwnTruck ? "truckUserId" : "userId", "==", userId], ["statusShipping", "!=", StatusShipping.COMPLETED]];
        let clausesOrderBy = [["statusShipping", "desc"], ["createdAt", "desc"]];
        let result = await firebaseFirestore.getPaginatedData(this.collection, clausesWhere, clausesOrderBy, pageSize, docStartAfter).catch(error => { throw error });
        return result;
    }
    async getSearchNewLoads(pageSize, docStartAfter) {
        let clausesWhere = [["statusShipping", "==", StatusShipping.NEW]];
        let clausesOrderBy = [["createdAt", "desc"]];
        let result = await firebaseFirestore.getPaginatedData(this.collection, clausesWhere, clausesOrderBy, pageSize, docStartAfter).catch(error => { throw error });
        return result;

        //return result;
        // const result = await firebaseFirestore.getAllData(this.collection, [["statusShipping", "==", 1]], [["createdAt", "desc"]]).catch(error => { throw error });
        // return result;
    }
    async saveTruckerRating(id, rating) {
        const result = await firebaseFirestore.updateData(this.collection, id, { "rating.truckerRating": rating }).catch(error => { throw error });
        return result;
    }
    async saveUserRating(id, rating) {
        const result = await firebaseFirestore.updateData(this.collection, id, { "rating.userRating": rating }).catch(error => { throw error });
        return result;
    }
    async getAll() {
        const result = await firebaseFirestore.getAllData(this.collection).catch(error => { throw error });
        return result;
    }
    async getAllLength() {
        const result = await firebaseFirestore.getAllDataLength(this.collection).catch(error => { throw error });
        return result;
    }
    async getAllCompletedLoads() {
        const result = await firebaseFirestore.getAllData(this.collection, [["statusShipping", "==", 5]]).catch(error => { throw error });
        return result;
    }
    async getAllCompletedLoadsLength() {
        const result = await firebaseFirestore.getAllDataLength(this.collection, [["statusShipping", "==", 5]]).catch(error => { throw error });
        return result;
    }
    async getAllUsersInDateRange(startDate, endDate) {
        startDate = new Date(startDate); startDate.setHours(0); startDate.setMinutes(0); startDate.setSeconds(0);
        endDate = new Date(endDate); endDate.setHours(0); endDate.setMinutes(0); endDate.setSeconds(0);
        const result = await firebaseFirestore.getAllData(this.collection, [["createdAt", ">=", new Date(startDate)], ["createdAt", "<=", new Date(endDate)]]).catch(error => { throw error });
        return result;
    }
    async getUserLoadSummary(userId) {
        const posted = await firebaseFirestore.getAllDataLength(this.collection, [["userId", "==", userId]]).catch(error => { throw error });
        const completed = await firebaseFirestore.getAllDataLength(this.collection, [["userId", "==", userId], ["statusShipping", "==", StatusShipping.COMPLETED]]).catch(error => { throw error });
        return { posted, completed };
    }
    async deleteLoad(id) {
        const result = await firebaseFirestore.deleteDoc(this.collection, id).catch(error => { throw error });
        return result;
    }
}

module.exports = Load;