const reportCtrl = require("../controllers/reportCtrl");
const auth = require("../middleware/auth");

const router = require("express").Router();

router.post('/create', auth, reportCtrl.report)

module.exports = router;