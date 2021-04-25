const express =require('express');
const { register, login, getMe, forgotPassword, resetPassword } = require('./../controller/auth')
const { protect } = require('./../middleware/authMiddleware') 

const router = express.Router()

router.post('/register', register);
router.post('/login',login)
router.get('/me',protect, getMe)
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword/:resettoken', resetPassword);
module.exports = router
