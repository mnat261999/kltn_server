const router = require("express").Router();
const postCtrl = require("../controllers/postCtrl");
const auth = require("../middleware/auth");

router
  .route("/posts")
  .post(auth, postCtrl.createPost)
  .get(auth, postCtrl.getPosts);

router.route("/posts/:id").patch(auth, postCtrl.updatePost);
router.route("/posts/:id/like").patch(auth, postCtrl.likePost);
router.route("/posts/:id/unlike").patch(auth, postCtrl.unLikePost);
module.exports = router;
