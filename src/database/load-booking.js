const firebaseFirestore = require("../services/firebase-firestore");

class LoadBooking {
    constructor({
        load_id = "",
        status = "",
        datetime = "",
        createdAt = "",
        updatedAt = ""
    }) {
        this.collection = 'loadbookings';
        this.load_id = load_id,
        this.status = status,
        this.datetime = datetime,
        this.createdAt = createdAt,
        this.updatedAt = updatedAt
    }

    async save() {
        const result = await firebaseFirestore.addData(this.collection, {
            load_id = this.load_id,
            status = this.status,
            datetime = this.datetime,
            createdAt = this.createdAt,
            updatedAt = this.updatedAt
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

module.exports = LoadBooking;