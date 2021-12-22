const jwt = require('jsonwebtoken');
const { promisify } = require('utils');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { signToken } = require('../utils/jwtFtns');
//routes
const signup = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);
  const token = await signToken(user._id);
  res.status(200).json({
    status: 'Success',
    message: 'Tour created successfully',
    token,
    data: newUser,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // if (!email || !password) {
  //   return next(new AppError('Please provide a email and password,', 400));
  // }

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

    const currentUser = await User.findByid(decoded.id);
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

const forgotPassword = (req, res, next) => {};
const resetPassword = (req, res, next) => {};

module.exports = {
  signup,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
};
