const express = require('express');
const router = express.Router();
// const { getAllTours } = require('../controllers/tourControllers');
const tourController = require('../controllers/tourControllers');
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
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTour, tourController.getAllTours); //cheapest Tour route
router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'superAdmin'),
    tourController.getMonthlyPlan
  );
//New version
router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guy'),
    tourController.createTour
  )
  .get(tourController.getAllTours);
router
  .route('/:id')
  .get(tourController.getSingleTour)
  .put(
    authController.protect,
    authController.restrictTo('admin', 'lead-guy'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'superAdmin'),
    tourController.deleteTour
  );

module.exports = router;
