const firebaseFirestore = require("../services/firebase-firestore");
const FieldValue = require('firebase-admin').firestore.FieldValue;
class User {
    constructor({
        uid = "",
        packageId = "",
        name = "",
        email = "",
        companyName = "",
        businessNumber = "",
        address = "",
        phoneNumber = "",
        carrierDocuments = [],
        favTruckUserIds = [],
        truck = null
    }) {
        this.collection = 'Users';
        this.uid = uid;
        this.packageId = packageId;
        this.name = name;
        this.email = email;
        this.companyName = companyName;
        this.businessNumber = businessNumber;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.carrierDocuments = carrierDocuments;
        this.favTruckUserIds = favTruckUserIds;
        this.hasOwnTruck = false;
        this.loadLimit = 0;
        this.truck = {};
        if (truck && (truck.truckType && truck.skidCapacity && truck.drivingExperience && truck.travelPreference)) {
            this.hasOwnTruck = true;
            this.truck.truckType = truck.truckType;
            this.truck.skidCapacity = truck.skidCapacity;
            this.truck.drivingExperience = truck.drivingExperience;
            this.truck.isInsured = truck.isInsured || false;
            this.truck.travelPreference = truck.travelPreference;
            this.truck.loadLimit = 0;
            this.truck.favLoadIds = [];
        }
        this.createdAt = firebaseFirestore.getServerTimeStamp();
    }

    async save() {
        //here we need to set the user load limit before saving
        const result = await firebaseFirestore.addData(this.collection, {
            uid: this.uid,
            packageId: this.packageId,
            name: this.name,
            email: this.email,
            companyName: this.companyName,
            businessNumber: this.businessNumber,
            address: this.address.toLowerCase(),
            phoneNumber: this.phoneNumber,
            carrierDocuments: this.carrierDocuments,
            favTruckUserIds: this.favTruckUserIds,
            hasOwnTruck: this.hasOwnTruck,
            truck: this.truck,
            createdAt: this.createdAt
        }, this.uid).catch((error) => {
            return error;
        });
        return result;
    }
    async update(id, obj) {
        let data = {};
        if (obj.name) data.name = obj.name;
        if (obj.companyName) data.companyName = obj.companyName;
        if (obj.businessNumber) data.businessNumber = obj.businessNumber;
        if (obj.address) data.address = obj.address;
        if (obj.phoneNumber) data.phoneNumber = obj.phoneNumber;
        if (obj.carrierDocuments) data.carrierDocuments = obj.carrierDocuments;
        if (obj.favTruckUserIds) data.favTruckUserIds = obj.favTruckUserIds;
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
    async getAllUsers() {
        const result = await firebaseFirestore.getAllData(this.collection).catch(error => { throw error });
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
        const result = await firebaseFirestore.getAllData(this.collection, [["createdAt", ">=", startDate], ["createdAt", "<=", endDate]]).catch(error => { throw error });
        return result;
    }
    async getSingleUser(id) {
        const result = await firebaseFirestore.getSingleData(this.collection, id).catch(error => { throw error });
        return result;
    }
    async getMultipleUsers(ids) {
        const result = await firebaseFirestore.getMultipleData(this.collection, ids).catch(error => { throw error });
        return result;
    }
    async getAllSearchUsers(address) {
        const result = await firebaseFirestore.getAllData(this.collection, [['address', '>', address], ['address', '<=', address + '\uf8ff']]).catch(error => { throw error });
        return result.filter((doc) => { return doc.data.hasOwnTruck == true });
    }
    async getAllTruckUsers() {
        const result = await firebaseFirestore.getAllData(this.collection, [['hasOwnTruck', '==', true]]).catch(error => { throw error });
        return result;
    }
    async saveFavTruckerProfile(id, favTruckUserId) {
        const result = await firebaseFirestore.updateData(this.collection, id, { "favTruckUserIds": FieldValue.arrayUnion(favTruckUserId) }).catch(error => { throw error });
        return result;
    }
    async deleteFavTruckerProfile(id, favTruckUserId) {
        const result = await firebaseFirestore.updateData(this.collection, id, { "favTruckUserIds": FieldValue.arrayRemove(favTruckUserId) }).catch(error => { throw error });
        return result;
    }
    async saveFavLoad(id, favLoadId) {
        const result = await firebaseFirestore.updateData(this.collection, id, { "truck.favLoadIds": FieldValue.arrayUnion(favLoadId) }).catch(error => { throw error });
        return result;
    }
    async deleteFavLoad(id, favLoadId) {
        const result = await firebaseFirestore.updateData(this.collection, id, { "truck.favLoadIds": FieldValue.arrayRemove(favLoadId) }).catch(error => { throw error });
        return result;
    }
}
module.exports = User;