const router = require("express").Router();
const commentCtrl = require("../controllers/commentCtrl");
const auth = require("../middleware/auth");

router.post("/create", auth, commentCtrl.createComment);

router.patch("/update/:id", auth, commentCtrl.updateComment)

router.get("/getbypost/:idPost", auth, commentCtrl.getCommentByPost)

router.patch('/like/:id', auth, commentCtrl.likeComment)

router.patch('/unlike/:id', auth, commentCtrl.unLikeComment)

router.patch('/reply', auth, commentCtrl.replyComment)

router.patch('/replyupdate/:id', auth, commentCtrl.updateReply)

router.delete('/delete/:id', auth, commentCtrl.deleteComment)

router.delete('/replydelete/:idComment/:idReply', auth, commentCtrl.deleteComment)

module.exports = router;
