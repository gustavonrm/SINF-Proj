const express = require('express')

const authCtrl = require('../controllers/auth-ctrl')

const router = express.Router()

router.post('/signup', authCtrl.signup)
router.post('/signin', authCtrl.signin)
router.get('/verify', authCtrl.verify)
router.get('/logout', authCtrl.logout)

module.exports = router