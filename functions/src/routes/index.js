var express = require('express');
var userRoute = require('./user/user.routes');
var adminRoute = require('./admin/admin.routes');
var router = express.Router();

router.use('/user', userRoute);
router.use('/admin', adminRoute);

module.exports = router;
