const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')

//account
router.post('/register', userCtrl.register)
router.post('/activation', userCtrl.activateEmail)
router.post('/login', userCtrl.login)
router.post('/refresh_token', userCtrl.getAccessToken)
router.post('/forgot', userCtrl.fogotPassword)
router.put('/reset',auth, userCtrl.resetPassword)
router.post('/logout',userCtrl.logout)

//Function for user
router.put('/block/:id', auth, userCtrl.blockUser)
router.put('/unblock/:id', auth, userCtrl.unblockUser)
router.get('/list/block', auth, userCtrl.getListBlockByUser)
router.get('/search_user', auth, userCtrl.searchUser)

module.exports = router
