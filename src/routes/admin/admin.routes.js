var express = require('express');
const { isAuthenticated } = require('../../middleware/authentication');
const adminController = require('./admin.controller');
var router = express.Router();

//Dashboard Reports
//Users
router.get('/get-all-users', adminController.getAllUsers);//done
//Free Plan
router.get('/get-free-plan', adminController.getFreePlan);//done
router.get('/update-free-plan', adminController.updateFreePlan);//done
//Packages
router.get('/get-all-packages', adminController.getAllPackages);//done
router.get('/save-package', adminController.savePackage);//done
router.get('/get-package', adminController.getPackage);//done
router.get('/update-package', adminController.updatePackage);//done
router.get('/delete-package', adminController.deletePackage);//done


module.exports = router;