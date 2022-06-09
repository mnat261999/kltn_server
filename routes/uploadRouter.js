const uploadCtrl = require('../controllers/uploadCtrl')
const auth = require('../middleware/auth')
const router = require('express').Router()
const multer  = require('multer')
const upload = multer()


router.post('/avatar', auth,upload.array("files",1), uploadCtrl.uploadAvatar)
router.post('/cover', auth,upload.array("files",1), uploadCtrl.uploadCover)
router.post('/media', auth,upload.array("files",10), uploadCtrl.uploadMediaPost)

module.exports = router