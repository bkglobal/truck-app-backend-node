const admin = require('firebase-admin');

class FirebaseMessaging {
    async sendDeviceNotification(token, title, body) {
        return new Promise(async (resolve, reject) => {
            try {
                admin.messaging().sendToDevice(token, {
                    notification: {
                        title: title,
                        body: body
                    }
                }).then(success => resolve(success)).catch(error => reject(error));
            }
            catch (error) {
                reject(error);
            }
        })
    }
}

module.exports = new FirebaseMessaging();