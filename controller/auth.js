const CoachingCenter= require('./../Model/coachingCenter');
const ErrorClass = require('./../config/errorClass');
const asyncHandler= require('./../middleware/asyncHandler');
const User = require('../Model/user');
const sendEmail= require('./../config/emailUtil')
const crypto = require('crypto')

exports.register =asyncHandler( async(req,res,next)=>{
    const { name, email, password, role}=req.body
    
    const user =await User.create({
        name,
        email,
        password,
        role
    })
    sendTokenResponse(user, 200, res);
})

exports.login =asyncHandler( async(req,res,next)=>{
    const {email, password }=req.body
    
    if (!email || !password){
        return next(new ErrorClass("Please provide email and password", 400))        
    }
    const user = await User.findOne({email}).select('+password') 

    if(!user){
        return next(new ErrorClass("Invalid Credential",401))
    }

    const isMatch = await user.matchPassword(password)
    if(!isMatch){
        return next( new ErrorClass("Invalid Credntials", 401))
    }

    sendTokenResponse(user, 200, res);
})

exports.logOut = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none',{
    expires: new Date(Date.now()+10*1000),
    httpOnly:true
  })  

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Update user details
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Update password
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});
// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
  
    res.status(200).json({
      success: true,
      data: user
    });
  });
  


// @desc      Forgot Password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({email:req.body.email});
  
  if(!user){
    return next(new ErrorClass(`Inavlid Email`,404))
  } 
  const resetToken =user.getResetPasswordToken()

  await user.save({ validateBeforeSave: false });
  const resetUrl =`${req.protocol}://${req.headers.host}/api/v1/auth/resetPassword/${resetToken}`;
   
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorClass('Email could not be sent', 500));
  }

});
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();
  
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };
  
    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }
  
    res
      .status(statusCode)
      .cookie('token', token, options)
      .json({
        success: true,
        token
      });
  };
// @desc      Reset Password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
  exports.resetPassword = asyncHandler(async (req, res, next) => {
    const resetPasswordToken =crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire:{$gt:Date.now()}
    });
  
    if (!user){
      return next(new ErrorClass('invaalid token',400))
    }

    user.password = req.body.password
    user.resetPasswordToken=undefined
    user.resetPasswordExpire=undefined

    await user.save()


    sendTokenResponse(user, 200, res);

  });
  