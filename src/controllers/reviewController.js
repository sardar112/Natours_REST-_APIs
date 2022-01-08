const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getAllReviews = catchAsync(async (req, res) => {
  let filter = {};
  if (req.params.tourId) filter.tourId = { tour: req.params.tourId };
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'Success',
    results: reviews.length,
    data: reviews,
  });
});

const createRiview = catchAsync(async (req, res) => {
  //Allowing nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newRewview = await Review.create(req.body);
  res.status(201).json({
    status: 'Success',
    message: 'Review created successfully',
    data: newRewview,
  });
});

module.exports = { createRiview, getAllReviews };
