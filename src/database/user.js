const firebaseFirestore = require("../services/firebase-firestore");

class User {
    constructor({
        uid = null,
        truckId = null,
        packageId = null,
        name = null,
        email = null,
        companyName = null,
        businessNumber = null,
        address = null,
        phoneNumber = null,
        carrierDocuments = null,
        savedTruckUserIds = null
    }) {
        this.collection = 'Users';
        this.uid = uid;
        this.truckId = truckId;
        this.packageId = packageId;
        this.name = name;
        this.email = email;
        this.companyName = companyName;
        this.businessNumber = businessNumber;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.carrierDocuments = carrierDocuments;
        this.savedTruckUserIds = savedTruckUserIds;
        this.createdAt = new Date().toLocaleString();
    }

    async save() {
        const result = await firebaseFirestore.addData(this.collection, {
            uid: this.uid,
            truckId: this.truckId,
            packageId: this.packageId,
            name: this.name,
            email: this.email,
            companyName: this.companyName,
            businessNumber: this.businessNumber,
            address: this.address,
            phoneNumber: this.phoneNumber,
            carrierDocuments: this.carrierDocuments,
            savedTruckUserIds: this.savedTruckUserIds,
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
    async getAll() {
        const result = await firebaseFirestore.getAllData(this.collection).catch(error => {return error});
        return result;
    }
}

module.exports = User;