const firebaseFirestore = require("../services/firebase-firestore");

class AppLog {
    constructor({
        description = "",
        user_id = 0,
        load_booking_id = 0,
        message_id = 0,
        createdAt = "",
        updatedAt = ""
    }) {
        this.collection = 'applog';
        this.description = description;
        this.user_id = user_id;
        this.load_booking_id = load_booking_id;
        this.message_id = message_id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    async save() {
        const result = await firebaseFirestore.addData(this.collection, {
            description = this.description,
            user_id = this.user_id,
            load_booking_id = this.load_booking_id,
            message_id = this.message_id,
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

module.exports = AppLog;