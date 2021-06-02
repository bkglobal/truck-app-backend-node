var express = require('express');
const adminController = require('./admin.controller');
const userController = require('../user/user.controller');
var router = express.Router();

//Dashboard Reports
router.get('/get-dashboard-summary-static', adminController.getDashboardSummaryStatic);
router.get('/get-dashboard-summary-dynamic', adminController.getDashboardSummaryDynamic);
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
//Queries
router.get('/get-users-queries', userController.getUsersQueries);
router.get('/get-query', userController.getQuery);
router.post('/update-user-query-reply', userController.updateUserQueryReply);
router.delete('/delete-query', userController.deleteQuery);
//Users
router.get('/get-all-users', adminController.getAllUsers);
router.post('/save-user', userController.signup);
router.post('/save-carrier-document', userController.saveCarrierDocument);
router.get('/get-user', userController.getUserDetail);
router.post('/update-user', userController.updateUser);
router.delete('/delete-user', adminController.deleteUser);
//Loads
router.get('/get-all-loads', adminController.getAllLoads);
router.get('/get-load', userController.getLoadDetail);
router.delete('/delete-load', userController.deleteLoad);

module.exports = router;