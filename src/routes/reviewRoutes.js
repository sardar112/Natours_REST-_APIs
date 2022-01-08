const express = require('express');
const router = express.Router({ mergeParams: true });

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// merge params handel req like this
//POST /tour/tourId/review or POST  /reviews
// through  mergeParams  we can access to tour id which is in tour controller
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createRiview
  );

module.exports = router;
