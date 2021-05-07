var express = require('express');
const { isAuthenticated } = require('../../middleware/authentication');
const adminController = require('./admin.controller');
var router = express.Router();

//Dashboard Reports
//Users
router.get('/get-all-users', adminController.getAllUsers);
//Free Plan
router.get('/get-free-plan', adminController.getFreePlan);
router.get('/update-free-plan', adminController.updateFreePlan);
//Packages
router.get('/get-all-packages', adminController.getAllPackages);
router.get('/save-package', adminController.savePackage);
router.get('/get-package', adminController.getPackage);
router.get('/update-package', adminController.updatePackage);
router.get('/delete-package', adminController.deletePackage);


module.exports = router;