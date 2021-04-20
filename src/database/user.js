const firebaseFirestore = require("../services/firebase-firestore");

class User {
    constructor({
        email = "",
        name = ""
    }) {
        this.collection = 'users';
        this.email = email;
        this.name = name;
    }

    async save() {
        const result = await firebaseFirestore.addData(this.collection, {
            email: this.email,
            name: this.name,
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

module.exports = User;