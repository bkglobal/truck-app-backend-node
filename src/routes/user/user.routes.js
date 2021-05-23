var express = require('express');
const userController = require('./user.controller');
const adminController = require('../admin/admin.controller');
const { fetchUser, isAuthenticated } = require('../../middleware/authentication');
var router = express.Router();

//Registering
router.post('/signup', userController.signup);//done
router.post('/save-carrier-document', userController.saveCarrierDocument);//done
//Premium Plans
router.post('/save-premium-plan', userController.savePremiumPlan);
router.get('/get-premium-plans', userController.getPremiumPlans);
//Routes as User
router.post('/update-user-profile', fetchUser, adminController.updateUser);//done
router.post('/save-user-load', fetchUser, userController.saveUserLoad);//done
router.get('/get-user-loads', fetchUser, userController.getUserLoads);//done
router.get('/get-completed-user-loads', fetchUser, userController.getCompletedUserLoads);//done
router.get('/get-inprogress-user-loads', fetchUser, userController.getInProgressUserLoads);//done
router.get('/get-load-detail', userController.getLoadDetail);//done
router.delete('/delete-load', userController.deleteLoad);//done
router.get('/get-search-truckers', userController.getSearchTruckers);//done
//router.get('/get-trucker-detail', userController.getTruckerDetail);//done
router.post('/save-trucker-rating', userController.saveTruckerRating);//done
router.get('/get-trucker-rating s', userController.getTruckerRatings);//done
router.post('/save-fav-trucker-profile', userController.saveFavTruckerProfile);//done
router.delete('/delete-fav-trucker-profile', userController.deleteFavTruckerProfile);//done
router.get('/get-fav-trucker-profiles', fetchUser, userController.getFavTruckerProfiles);//done
//Routes as Trucker
router.get('/get-search-new-loads', userController.getSearchNewLoads);//done
router.post('/save-load-book', userController.saveLoadBook);//done
router.post('/update-load-status', userController.updateLoadStatus);//done
router.get('/get-user-detail', userController.getUserDetail);//done
//router.get('/get-trucker-loads', userController.getTruckerLoads);//done
router.post('/save-user-rating', userController.saveUserRating);//done
router.get('/get-user-ratings', userController.getUserRatings);//done
router.post('/save-fav-load', userController.saveFavLoad);//done
router.delete('/delete-fav-load', userController.deleteFavLoad);//done
router.get('/get-fav-loads', userController.getFavLoads);//done

module.exports = router;