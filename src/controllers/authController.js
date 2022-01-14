const jwt = require('jsonwebtoken');
const { promisify } = require('');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const { signToken } = require('../utils/jwtFunction');

const createSendToken = async (user, statusCode, res) => {
  const token = await signToken(user._id);
  // sending token in cookie
  const cookieOption = {
    expiresIn: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), //process.env.expiresin
    // secure: true     if it is in production mode
    httpOnly: true,
  };
  if (process.env.NODE_ENV == 'production') cookieOption.secure = true;
  res.cookie('jwtToken', token, cookieOption);
  // for not showing to user
  user.password = undefined;
  res.status(statusCode).json({
    status: 'Success',
    token,
    data: { user },
  });
};

//routes
const signup = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);
  const token = await signToken(newUser._id);
  res.status(200).json({
    status: 'Success',
    message: 'Tour created successfully',
    token,
    data: newUser,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide a email and password,', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = await signToken(user._id);
  res.status(200).json({
    status: 'Success',
    token,
  });
});

const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return next(new AppError('You are not logged in', 401));
    }
    // const decod = jwt.verify(token, process.env.JWT_SECRET);
    //verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //check if user exists

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('user does not exist', 401));
    }
    //check if user changed the password after login

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          'user recently changed the password ,please login again',
          401
        )
      );
    }
  }

  //Grant access to protected  routes
  req.user = currentUser;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('Access denied for user  to perform this action', 403)
      );
    }
    next();
  };
};

const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    next(new AppError(`There is no user with email  ${req.body.email}`, 404));
  }
  const resetToken = user.correctPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //send it to user email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = ` Forgot your password? Submit a PATCH request with your new password and confirm password to: ${resetURL}.\nIf you didn't forgot your password, please ignore this email`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min) ',
      message,
    });
    res.status(200).json({ status: 'success', message: 'Token sent to email' });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email, please try again later',
        500
      )
    );
  }
});
const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { gte: Date.now() },
  });
  if (!user) return next(new AppError('Token is invalid or expired', 400));
  user.password = req.body.password;
  confirmPassword = req.body.ConfirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.save();
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('+password');
  if (!(await user.correctPassword(req.body.password, user.password))) {
    return next(new AppError('Invalid password', 401));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  const token = await signToken(user._id);
  res.status(200).json({
    status: 'Success',
    message: 'Password Updated successfully',
    token,
    data: { user },
  });
});

module.exports = {
  signup,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
  createSendToken,
};
