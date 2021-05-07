var express = require('express');
const { isAuthenticated } = require('../../middleware/authentication');
const userController = require('./user.controller');
var router = express.Router();

//Registering
router.post('/signup', userController.signup);//done
router.post('/save-carrier-document', userController.saveCarrierDocument);//done
//Premium Plans
router.post('/save-premium-plan', userController.savePremiumPlan);
router.get('/get-premium-plans', userController.getPremiumPlans);
//Routes as User
router.post('/save-user-load', userController.saveUserLoad);//done
router.get('/get-user-loads', userController.getUserLoads);//done
router.get('/get-load-detail', userController.getLoadDetail);//done
router.get('/get-search-truckers', userController.getSearchTruckers);//done
router.get('/get-trucker-detail', userController.getTruckerDetail);//done
router.post('/save-trucker-rating', userController.saveTruckerRating);//done
router.get('/get-trucker-ratings', userController.getTruckerRatings);//done
router.post('/save-fav-trucker-profile', userController.saveFavTruckerProfile);//done
router.get('/get-fav-trucker-profiles', userController.getFavTruckerProfiles);//done
//Routes as Trucker
router.get('/get-search-loads', userController.getSearchLoads);//done
router.post('/save-load-book', userController.saveLoadBook);//done
router.post('/update-load-status', userController.updateLoadStatus);//done
router.get('/get-user-detail', userController.getUserDetail);//done
router.get('/get-trucker-loads', userController.getTruckerLoads);//done
router.post('/save-user-rating', userController.saveUserRating);//done
router.get('/get-user-ratings', userController.getUserRatings);//done
router.post('/save-fav-load', userController.saveFavLoad);//done
router.get('/get-fav-loads', userController.getFavLoads);//done

module.exports = router;