const firebaseFirestore = require("../services/firebase-firestore");
const User = require("./user");
const StatusShipping = {
    "NEW": 1,
    "BOOKED": 2,
    "DESTINATION": 3,
    "DELIVERED": 4,
    "COMPLETED": 5
};
class Load {
    constructor({
        userId = "",
        truckUserId = "",
        loadItemName = "",
        skidCount = "",
        weight = "",
        pickupAddress = "",
        dropOffAddress = "",
        dateTime = Date.now(),
        priceRange = ""
    }) {
        this.collection = 'Loads';
        this.fields = {
            userId: userId,
            truckUserId: truckUserId,
            loadItemName: loadItemName.toLowerCase(),
            skidCount: skidCount,
            weight: weight,
            pickupAddress: pickupAddress,
            dropOffAddress: dropOffAddress,
            // pickupAddress: {
            //     address: "",
            //     city: "",
            //     country: ""
            // },
            // dropOffAddress: {
            //     address: "",
            //     city: "",
            //     country: ""
            // },
            dateTime: new Date(dateTime).toISOString(),
            priceRange: priceRange,
            statusShipping: StatusShipping.NEW,//1:NEW, 2:BOOKED, 3:DESTINATION, 4:DELIVERED, 5:COMPLETED
            rating: {
                truckerRating: 0,
                userRating: 0
            }
        }
        this.createdAt = firebaseFirestore.getServerTimeStamp();
        // if (pickupAddress && (pickupAddress.address && pickupAddress.city && pickupAddress.country)) {
        //     this.fields.pickupAddress.address = pickupAddress.address;
        //     this.fields.pickupAddress.city = pickupAddress.city;
        //     this.fields.pickupAddress.country = pickupAddress.country;
        // }
        // if (dropOffAddress && (dropOffAddress.address && dropOffAddress.city && dropOffAddress.country)) {
        //     this.fields.dropOffAddress.address = dropOffAddress.address;
        //     this.fields.dropOffAddress.city = dropOffAddress.city;
        //     this.fields.dropOffAddress.country = dropOffAddress.country;
        // }
    }
    async save() {
        const result = await firebaseFirestore.addData(this.collection, {
            ...this.fields,
            createdAt: this.createdAt
        }).catch(error => { throw error });
        return result;
    }
    async update(id, obj) {
        let data = {};
        if (obj.statusShipping) data.statusShipping = obj.statusShipping;
        const result = await firebaseFirestore.updateData(this.collection, id, data).catch(error => { throw error });
        //handle notification here
        //this.notifyOnLoadStatusChanged(id, data.statusShipping);
        return result;
    }
    async getLoad(id, { truck }) {
        const result = await firebaseFirestore.getSingleData(this.collection, id).catch(error => { throw error });
        let postedUser = await new User({}).getSingleUser(result.userId);
        result["postedBy"] = { name: postedUser.name, id: postedUser.uid };
        result["isFavorite"] = truck.favLoadIds ? (truck.favLoadIds.indexOf(id) > -1) : false;
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
    async getSearchNewLoads(pageSize, docStartAfter, filter = {}) {
        let clausesWhere = [["statusShipping", "==", StatusShipping.NEW]];
        if (filter.skidCount) clausesWhere.push(["skidCount", "==", filter.skidCount]);
        if (filter.weight) clausesWhere.push(["weight", "==", filter.weight]);
        let clausesOrderBy = [["createdAt", "desc"]];
        let result = await firebaseFirestore.getPaginatedData(this.collection, clausesWhere, clausesOrderBy, pageSize, docStartAfter).catch(error => { throw error });
        return result;
    }
    async getSearchNewLoadsByName(pageSize, docStartAfter, filter = {}) {
        let clausesWhere = [["statusShipping", "==", StatusShipping.NEW]];
        if (filter.loadItemName) { clausesWhere.push(["loadItemName", ">=", filter.loadItemName]); clausesWhere.push(["loadItemName", "<=", filter.loadItemName + '\uf8ff']); }
        let result = await firebaseFirestore.getPaginatedData(this.collection, clausesWhere, undefined, pageSize, docStartAfter).catch(error => { throw error });
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
        const user = await new User({}).getSingleUser(userId);
        const posted = await firebaseFirestore.getAllDataLength(this.collection, [["userId", "==", userId]]).catch(error => { throw error });
        const completed = await firebaseFirestore.getAllDataLength(this.collection, [["userId", "==", userId], ["statusShipping", "==", StatusShipping.COMPLETED]]).catch(error => { throw error });
        return {
            posted, completed, user: {
                name: user["name"],
                address: user["address"],
                companyName: user["companyName"],
                businessNumber: user["businessNumber"]
            }
        };
    }
    async deleteLoad(id) {
        const result = await firebaseFirestore.deleteDoc(this.collection, id).catch(error => { throw error });
        return result;
    }
    //***************Notification Handlers */
    async notifyOnLoadStatusUpdate(loadId, status){

    }
}

module.exports = Load;