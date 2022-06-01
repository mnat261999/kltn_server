const uploadCtrl = require('../controllers/uploadCtrl')
const router = require('express').Router()
const multer  = require('multer')
const upload = multer()


router.post('/avatar', upload.array("files",1), uploadCtrl.uploadAvatar)

module.exports = router