const coverCtrl = require('../controllers/coverCtrl')
const auth = require('../middleware/auth')

const router = require('express').Router()

router.put('/update', auth, coverCtrl.updateCover)

router.get('/all', auth, coverCtrl.getAllCoverByUser)

router.delete('/delete/:id', auth, coverCtrl.deleteCover)

module.exports = router