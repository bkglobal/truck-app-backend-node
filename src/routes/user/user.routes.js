var express = require('express');
const { isAuthenticated } = require('../../middleware/authentication');
const userController = require('./user.controller');
var router = express.Router();

router.route('/').get( userController.getUsers);
router.post('/signup', userController.singup);

module.exports = router;