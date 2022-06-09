const router = require("express").Router();
const postCtrl = require("../controllers/postCtrl");
const auth = require("../middleware/auth");

router.post('/create', auth, postCtrl.createPost)
router.get('/getall', auth, postCtrl.getPosts)
router.put('/update/:id', auth, postCtrl.updatePost)
router.patch('/like/:id', auth, postCtrl.likePost)
router.patch('/unlike/:id', auth, postCtrl.unLikePost)

module.exports = router;
