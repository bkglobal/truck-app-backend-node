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
        res.json({ Message: msg, Code: code, Result: result ? result : {} });
        res.end();
    },
    parseError: function (error) {
        // 0:     Server Error
        // 1:     Operation Successful
        // 2:     Access-Denied
        // 3:     Access Token
        // 5-20:  ID's Errors
        // 21-50: Field Errors
        if (!error) return { code: 1, msg: "Operation Successful" };
        let obj;
        switch (error) {
            case 'error':
                obj = { code: 0, msg: "Internal Server Error" };
                break;
            case 'access-denied':
                obj = { code: 2, msg: "Access Denied" };
                break;
            case 'token':
                obj = { code: 3, msg: "Access Token Required" };
                break;
            case 'unauth':
                obj = { code: 4, msg: "Unauthorize User" };
                break;
            //ID's Errors
            case 'userId':
                obj = { code: 5, msg: "userId Required" };
                break;
            case 'truckUserId':
                obj = { code: 6, msg: "truckUserId Required" };
                break;
            case 'loadId':
                obj = { code: 7, msg: "loadId Required" };
                break;
            case 'packageId':
                obj = { code: 8, msg: "packageId Required" };
                break;
            //Field Errors
            case 'auth/invalid-email':
                obj = { code: 21, msg: "Invalid Email" };
                break;
            case 'auth/invalid-password':
                obj = { code: 22, msg: "Invalid Password" };
                break;
            case 'auth/email-already-exists':
                obj = { code: 23, msg: "Email Already Exist" };
                break;
            case 'file':
                obj = { code: 24, msg: "File Required" };
                break;
            case 'address':
                obj = { code: 25, msg: "Address Required" };
                break;
            case 'rating':
                obj = { code: 26, msg: "Rating Required" };
                break;
            case 'skidCount':
                obj = { code: 27, msg: "Skids Count Required" };
                break;
            default:
                obj = { code: 0, msg: "Internal Server Error" };
                break;
        }
        return obj;
    }
}