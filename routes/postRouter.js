const router = require("express").Router();
const postCtrl = require("../controllers/postCtrl");
const auth = require("../middleware/auth");

router.post('/create', auth, postCtrl.createPost)
router.get('/newfeed', auth, postCtrl.getPosts)
router.patch('/:id', auth, postCtrl.updatePost)
router.patch('/like/:id', auth, postCtrl.likePost)
router.patch('/unlike/:id', auth, postCtrl.unLikePost)
router.get('/byuserlogin', auth, postCtrl.getPotsByUserLogin)
router.get('/byuserid/:id', auth, postCtrl.getPostByUserId)
router.delete('/delete/:id', auth, postCtrl.deletePost)

module.exports = router;
