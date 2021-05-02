var express = require('express');
const { isAuthenticated } = require('../../middleware/authentication');
const userController = require('./user.controller');
var router = express.Router();

// router.post('/', (req, res)=>{
//     console.log(req.body);
//     res.send("user route");
// });
router.post('/signup', userController.signup);
router.post('/:uid/carrier-document', userController.uploadCarrierDocument);
router.post('/:uid/load', userController.postUserLoad);
router.get('/:uid/load/:idl', userController.getUserLoad);
router.get('/search-truck', userController.getSearchTrucks);
router.post('/search-load', userController.getSearchLoads);


module.exports = router;