const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowFields.includes(key)) newObj[key] = obj[key];
  });
  return newObj;
};

const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError('Cant updated your password with this request', 401)
    );
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true, runValidators: true }
  );

  const token = await signToken(user._id);
  res.status(200).json({
    status: 'Success',
    message: 'User Updated successfully',
    token,
    data: { updatedUser },
  });
});
const deleteMe = catchAsync(async (req, res, next) => {
  const deleteUser = await User.findByIdAndUpdate(req.params.id, {
    active: false,
  });
  res.status(204).json({
    status: 'Success',
    message: 'User deleted successfully',
    data: null,
  });
});

module.exports = { updateMe, deleteMe };
