const firebaseFirestore = require("../services/firebase-firestore");

class Truck {
    constructor({
        truckType = null,
        skidCapacity = null,
        drivingExperience = null,
        isInsured = false,
        travelPreference = null,
        savedLoadIds = null
    }) {
        this.collection = 'Trucks';
        this.truckType = truckType;
        this.skidCapacity = skidCapacity;
        this.drivingExperience = drivingExperience;
        this.isInsured = isInsured;
        this.travelPreference = travelPreference;
        this.savedLoadIds = savedLoadIds;
        this.createdAt = new Date().toLocaleString();
    }

    async save() {
        const result = await firebaseFirestore.addData(this.collection, {
            truckType: this.truckType,
            skidCapacity: this.skidCapacity,
            drivingExperience: this.drivingExperience,
            isInsured: this.isInsured,
            travelPreference: this.travelPreference,
            savedLoadIds: this.savedLoadIds,
            createdAt: this.createdAt
        }).catch((error) => {
            return error;
        });
        return result;
    }
    async getAll() {
        const result = await firebaseFirestore.getAllData(this.collection).catch((error) => {
            return error;
        });
        return result;
    }
}

module.exports = Truck;