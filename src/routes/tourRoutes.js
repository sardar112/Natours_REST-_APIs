const express = require('express');
const router = express.Router();
// const { getAllTours } = require('../controllers/tourControllers');
const tour = require('../controllers/tourControllers');

//Old version
// router.post('/', tour.createTour);
// router.get('/', tour.getAllTours);
// router.get('/:id', tour.getSingleTour);
// router.put('/:id', tour.editTour);
// router.delete('/:id', tour.deleteTour);

//New version
router.route('/').post(tour.createTour).get(tour.getAllTours);
router
  .route('/:id')
  .get(tour.getSingleTour)
  .put(tour.editTour)
  .delete(tour.deleteTour);

module.exports = router;
