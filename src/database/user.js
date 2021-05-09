const firebaseFirestore = require("../services/firebase-firestore");

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
            this.favLoadIds = [];
        }
        this.createdAt = new Date().toLocaleString();
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
    async update(id, data) {
        const result = await firebaseFirestore.updateData(this.collection, id, data).catch((error) => {
            return error;
        });
        return result;
    }
    async getAllUsers() {
        const result = await firebaseFirestore.getAllData(this.collection).catch(error => { return error });
        return result;
    }
    async getSingleUser(id) {
        const result = await firebaseFirestore.getSingleData(this.collection, id).catch(error => { return error });
        return result;
    }
    async getAllSearchUsers(address) {
        const result = await firebaseFirestore.getAllDataWithCriteria(this.collection, [['address', '>=', address], ['address', '<=', address + '\uf8ff']]).catch(error => { return error });
        return result.filter((doc)=> {return doc.data.hasOwnTruck == true});
    }
}

module.exports = User;