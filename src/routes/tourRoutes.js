const express = require('express');
const router = express.Router();
// const { getAllTours } = require('../controllers/tourControllers');
const tour = require('../controllers/tourControllers');
const authController = require('../controllers/authController');
const reviewRoutes = require('../routes/reviewRoutes');

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createRiview
//   );
// merge params concept
reviewRoutes.use('/:tourId/reviews', reviewRoutes);

//Old version
// router.post('/', tour.createTour);
// router.get('/', tour.getAllTours);
// router.get('/:id', tour.getSingleTour);
// router.put('/:id', tour.editTour);
// router.delete('/:id', tour.deleteTour);
// router.delete('/:id', tour.deleteTour);
router.route('/top-5-cheap').get(tour.aliasTopTour, tour.getAllTours); //cheapest Tour route
router.route('/tour-stats').get(tour.getTourStats);
router.route('/monthly-plan/:year').get(tour.getMonthlyPlan);
//New version
router.route('/').post(tour.createTour).get(tour.getAllTours);
router
  .route('/:id')
  .get(tour.getSingleTour)
  .put(tour.editTour)
  .delete(tour.deleteTour, authController.restrictTo('admin', 'superAdmin'));

router
  .route('/:tourId/reviews')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createRiview
  );

module.exports = router;
