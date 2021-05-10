const fileUploadPath = "public/docs";
module.exports = {
    fileUploadPath,
    uploadFile: function (file, url) {
        return new Promise((resolve, reject) => {
            file.mv(`${url}`, async function (err) {
                if (err) {
                    console.log(err);
                    reject(false);
                }
                resolve(true);
            });
        });
    }
}