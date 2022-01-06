const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getAllReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find();
  if (reviews.length) {
    res.status(200).json({
      status: 'Success',
      results: reviews.length,
      data: reviews,
    });
  } else {
    res.status(400).json({
      status: 'Fail',
      message: 'Could not find review',
    });
  }
});

const createRiview = catchAsync(async (req, res) => {
  const newRewview = await Review.create(req.body);
  if (newRewview) {
    res.status(201).json({
      status: 'Success',
      message: 'Review created successfully',
      data: newRewview,
    });
  } else {
    res.status(400).json({
      status: 'Fail',
      message: 'Coud not create review',
    });
  }
});

module.exports = { createRiview, getAllReviews };
