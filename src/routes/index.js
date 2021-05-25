var express = require('express');
var userRoute = require('./user/user.routes');
var adminRoute = require('./admin/admin.routes');
var router = express.Router();
const { StatusShipping } = require('../helper/constants');

router.use('/user', userRoute);
router.use('/admin', adminRoute);
router.use('/help', (req, res) =>{
    res.json([
        {
            Model: "Load",
            Description: {
                "key-statusShipping": StatusShipping
            }
        }
    ]);
});

module.exports = router;
