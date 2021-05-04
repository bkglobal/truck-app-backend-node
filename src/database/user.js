const firebaseFirestore = require("../services/firebase-firestore");

class User {
    constructor({
        uid = null,
        packageId = null,
        name = null,
        email = null,
        companyName = null,
        businessNumber = null,
        address = null,
        phoneNumber = null,
        carrierDocuments = null,
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
        this.truck = {};
        if (truck && (truck.truckType && truck.skidCapacity && truck.drivingExperience && truck.travelPreference)) {
            this.hasOwnTruck = true;
            this.truck.truckType = truck.truckType;
            this.truck.skidCapacity = truck.skidCapacity;
            this.truck.drivingExperience = truck.drivingExperience;
            this.truck.isInsured = truck.isInsured || false;
            this.truck.travelPreference = truck.travelPreference;
            this.favLoadIds = [];
        }
        this.createdAt = new Date().toLocaleString();
    }

    async save() {
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