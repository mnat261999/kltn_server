const router = require("express").Router();
const commentCtrl = require("../controllers/commentCtrl");
const auth = require("../middleware/auth");

router.post("/comment", auth, commentCtrl.createComment);

router.route("/comment/:id").patch(auth, commentCtrl.updateComment);

module.exports = router;
