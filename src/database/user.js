const firebaseFirestore = require("../services/firebase-firestore");
const firebaseMessaging = require("../services/firebase-messaging");
const FieldValue = require('firebase-admin').firestore.FieldValue;
class User {
    constructor({
        uid = "",
        packageId = "",
        name = "",
        email = "",
        companyName = "",
        businessNumber = "",
        phoneNumber = "",
        address = "",
        // address = {},
        carrierDocuments = [],
        favTruckUserIds = [],
        truck = null
    }) {
        this.collection = 'Users';
        this.fields = {
            uid: uid,
            packageId: packageId,
            name: name.toLowerCase(),
            email: email,
            companyName: companyName,
            businessNumber: businessNumber,
            phoneNumber: phoneNumber,
            carrierDocuments: carrierDocuments,
            favTruckUserIds: favTruckUserIds,
            hasOwnTruck: false,
            loadLimit: 0,
            // address: {
            //     address: "",
            //     city: "",
            //     country: ""
            // },
            address: address,
            truck: {},
            fcmToken: ""
        }
        this.createdAt = firebaseFirestore.getServerTimeStamp();

        // if (address && (address.address && address.city && address.country)) {
        //     this.fields.address.address = address.address;
        //     this.fields.address.city = address.city;
        //     this.fields.address.country = address.country;
        // }
        if (truck && (truck.truckType && truck.skidCapacity && truck.drivingExperience && truck.travelPreference)) {
            this.fields.hasOwnTruck = true;
            this.fields.truck.truckType = truck.truckType;
            this.fields.truck.skidCapacity = truck.skidCapacity;
            this.fields.truck.drivingExperience = truck.drivingExperience;
            this.fields.truck.isInsured = truck.isInsured || false;
            this.fields.truck.travelPreference = truck.travelPreference;
            this.fields.truck.loadLimit = 0;
            this.fields.truck.favLoadIds = [];
        }
    }
    async save() {
        //here we need to set the user load limit before saving
        const result = await firebaseFirestore.addData(this.collection, {
            ...this.fields,
            createdAt: this.createdAt
        }, this.fields.uid).catch((error) => {
            throw error;
        });
        return result;
    }
    async update(id, obj) {
        let data = {};
        if (obj.name) data.name = obj.name;
        if (obj.companyName) data.companyName = obj.companyName;
        if (obj.businessNumber) data.businessNumber = obj.businessNumber;
        if (obj.phoneNumber) data.phoneNumber = obj.phoneNumber;
        if (obj.carrierDocuments) data.carrierDocuments = obj.carrierDocuments;
        if (obj.favTruckUserIds) data.favTruckUserIds = obj.favTruckUserIds;
        if (obj.fcmToken) data.fcmToken = obj.fcmToken;
        if (obj.address) data.address = obj.address;

        // let { address } = obj;
        // if (address) {
        //     if (address.address) data["address.address"] = address.address;
        //     if (address.city) data["address.city"] = address.city;
        //     if (address.country) data["address.country"] = address.country;
        // }
        let { truck } = obj;
        if (truck) {
            if (truck.truckType) data["truck.truckType"] = truck.truckType;
            if (truck.skidCapacity) data["truck.skidCapacity"] = truck.skidCapacity;
            if (truck.drivingExperience) data["truck.drivingExperience"] = truck.drivingExperience;
            if (truck.isInsured) data["truck.isInsured"] = truck.isInsured;
            if (truck.travelPreference) data["truck.travelPreference"] = truck.travelPreference;
            if (truck.favLoadIds) data["truck.favLoadIds"] = truck.favLoadIds;
        }
        const result = await firebaseFirestore.updateData(this.collection, id, data).catch(error => { throw error });
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
    async getAllUsersInDateRange(startDate, endDate) {
        startDate = new Date(startDate); startDate.setHours(0); startDate.setMinutes(0); startDate.setSeconds(0);
        endDate = new Date(endDate); endDate.setHours(0); endDate.setMinutes(0); endDate.setSeconds(0);
        const result = await firebaseFirestore.getAllDataLength(this.collection, [["createdAt", ">=", startDate], ["createdAt", "<=", endDate]]).catch(error => { throw error });
        return result;
    }
    async getSingleUser(id) {
        const result = await firebaseFirestore.getSingleData(this.collection, id).catch(error => { throw error });
        return result;
    }
    async getMultipleUsers(ids) {
        const result = await firebaseFirestore.getMultipleData(this.collection, ids).catch(error => { throw error });
        return result.map((data) => ({ ...data, isFavorite: true }));
    }
    async getAllSearchUsers(address) {
        const result = await firebaseFirestore.getAllData(this.collection, [['address', '>', address], ['address', '<=', address + '\uf8ff']]).catch(error => { throw error });
        return result.filter((doc) => { return doc.data.hasOwnTruck == true });
    }
    async getAllTruckUsers(requestedUser, pageSize, docStartAfter, filter = {}) {
        let clausesWhere = [["hasOwnTruck", "==", true]];
        if(filter.truckType) clausesWhere.push(["truck.truckType", "==", filter.truckType]);
        if(filter.skidCapacity) clausesWhere.push(["truck.skidCapacity", "==", filter.skidCapacity]);
        let clausesOrderBy = [["createdAt", "desc"]];
        let result = await firebaseFirestore.getPaginatedData(this.collection, clausesWhere, clausesOrderBy, pageSize, docStartAfter).catch(error => { throw error });
        return result.map((data) => ({ ...data, isFavorite: requestedUser.favTruckUserIds.indexOf(data.id) > -1 }));
    }
    async getAllTruckUsersByName(requestedUser, pageSize, docStartAfter, filter = {}) {
        let clausesWhere = [["hasOwnTruck", "==", true]];
        if(filter.truckerName) {clausesWhere.push(["name", ">=", filter.truckerName]);clausesWhere.push(["name", "<=", filter.truckerName+'\uf8ff']);}
        let result = await firebaseFirestore.getPaginatedData(this.collection, clausesWhere, undefined, pageSize, docStartAfter).catch(error => { throw error });
        return result.map((data) => ({ ...data, isFavorite: requestedUser.favTruckUserIds.indexOf(data.id) > -1 }));
    }
    async saveFavTruckerProfile(id, { favTruckUserId, isFavorite }) {
        const result = await firebaseFirestore.updateData(this.collection, id, { "favTruckUserIds": isFavorite ? FieldValue.arrayUnion(favTruckUserId) : FieldValue.arrayRemove(favTruckUserId) }).catch(error => { throw error });
        return result;
    }
    async saveFavLoad(id, { favLoadId, isFavorite }) {
        const result = await firebaseFirestore.updateData(this.collection, id, { "truck.favLoadIds": isFavorite ? FieldValue.arrayUnion(favLoadId) : FieldValue.arrayRemove(favLoadId) }).catch(error => { throw error });
        return result;
    }
    async sendNotification(token, title, body) {
        const result = await firebaseMessaging.sendDeviceNotification(token, title, body).catch(error => { throw error });
        return result;
    }
}
module.exports = User;