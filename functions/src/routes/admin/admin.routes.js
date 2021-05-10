var express = require('express');
const { isAuthenticated } = require('../../middleware/authentication');
const adminController = require('./admin.controller');
var router = express.Router();

//Dashboard Reports
//Free Plan
router.post('/save-free-plan', adminController.saveFreePlan);
router.get('/get-free-plan', adminController.getFreePlan);
router.post('/update-free-plan', adminController.updateFreePlan);
//Packages
router.get('/get-all-packages', adminController.getAllPackages);
router.post('/save-package', adminController.savePackage);
router.get('/get-package', adminController.getPackage);
router.post('/update-package', adminController.updatePackage);
router.delete('/delete-package', adminController.deletePackage);
//Users
router.get('/get-all-users', adminController.getAllUsers);
router.get('/get-user', adminController.getAllUsers);
router.get('/update-user', adminController.getAllUsers);
router.get('/delete-user', adminController.getAllUsers);
//Loads
router.get('/get-all-loads', adminController.getAllUsers);
router.get('/get-load', adminController.getAllUsers);

module.exports = router;