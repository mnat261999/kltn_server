const router = require("express").Router();
const commentCtrl = require("../controllers/commentCtrl");
const auth = require("../middleware/auth");

router.post("/create", auth, commentCtrl.createComment);

router.patch("/update/:id", auth, commentCtrl.updateComment)

router.get("/getbypost/:idPost", auth, commentCtrl.getCommentByPost)

module.exports = router;
