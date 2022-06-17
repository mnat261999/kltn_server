const router = require('express').Router()
const policyCtrl = require('../controllers/policyCtrl');
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/auth");

router.post('/create', auth,authAdmin, policyCtrl.createPolicy)
router.patch('/update/:id', auth,authAdmin, policyCtrl.updatePolicy)
router.delete('/delete/:id', auth,authAdmin, policyCtrl.deletePolicy)

module.exports = router;