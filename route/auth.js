const express =require('express');
const { register, login, getMe, forgotPassword, resetPassword, updatePassword, updateDetails, logOut } = require('./../controller/auth')
const { protect } = require('./../middleware/authMiddleware') 

const router = express.Router()

router.post('/register', register);
router.post('/login',login)
router.post('/logout',logOut )
router.get('/me',protect, getMe)
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword/:resettoken', resetPassword);
router.put('/updatepassword', protect, updatePassword);
router.put('/updatedetails', protect , updateDetails);


module.exports = router
