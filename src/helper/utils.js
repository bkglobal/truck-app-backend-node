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
    },
    response: function (res, { msg, code }, result) {
        res.status(200);
        res.json({ Message: msg, Code: code, Result: result });
        res.end();
    },
    parseError: function (error) {
        console.log(error);
        let obj;
        switch (error) {
            case '-':
                obj = { code: 1, msg: "Operation Successful" };
                break;
            case 'auth/invalid-email':
                obj = { code: 2, msg: "Invalid Email" };
                break;
            case 'auth/invalid-password':
                obj = { code: 3, msg: "Invalid Password" };
                break;
            case 'auth/email-already-exists':
                obj = { code: 4, msg: "Email Already Exist" };
                break;
            case 'userId':
                obj = { code: 5, msg: "userId Required" };
                break;
            case 'truckUserId':
                obj = { code: 6, msg: "truckUserId Required" };
                break;
            case 'file':
                obj = { code: 7, msg: "File Required" };
                break;
            case 'loadId':
                obj = { code: 8, msg: "loadId Required" };
                break;
            case 'address':
                obj = { code: 9, msg: "Address Required" };
                break;
            case 'rating':
                obj = { code: 10, msg: "Rating Required" };
                break;
            case 'skidCount':
                obj = { code: 11, msg: "Skids Count Required" };
                break;
            case 'packageId':
                obj = { code: 11, msg: "packageId Required" };
                break;
            default:
                obj = { code: 0, msg: "Server Error" };
                break;
        }
        return obj;
    }
}