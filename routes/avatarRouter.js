const avatarCtrl = require('../controllers/avatarCtrl')
const auth = require('../middleware/auth')

const router = require('express').Router()

router.put('/update', auth, avatarCtrl.updateAvatar)

router.get('/all', auth, avatarCtrl.getAllAvatarByUser)

router.delete('/delete/:id', auth, avatarCtrl.deleteAvatar)

module.exports = router