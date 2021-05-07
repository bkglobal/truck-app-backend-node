const firebaseFirestore = require("../services/firebase-firestore");

class Message {
    constructor({
        sender_id = 0,
        receiver_id = 0,
        is_active = false,
        createdAt = "",
        updatedAt = "",
    }) {
        this.collection = 'messages';
        this.sender_id = sender_id;
        this.receiver_id = receiver_id;
        this.is_active = is_active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    async save() {
        const result = await firebaseFirestore.addData(this.collection, {
            sender_id = this.sender_id,
            receiver_id = this.receiver_id,
            is_active = this.is_active,
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

module.exports = Message;