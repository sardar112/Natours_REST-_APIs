const Tour = require('./../models/tourModel');
const factory = require('../controllers/handleFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

//Aliasing thisnis only for when most used route is needed .ie user wants five best cheep things
const aliasTopTour = (req, res, next) => {
  req.query.limit = '5';
  //   req.query.sort = "-property,proprty"
  req.query.sort = '-name';
  req.query.fields = 'name,price,summary,difficulty';
  next();
};

const getAllTours = factory.getAll(Tour);
const getSingleTour = factory.getOne(Tour, { path: 'reviews' });
const createTour = factory.createOne(Tour);
const deleteTour = factory.deleteOne(Tour);
const updateTour = factory.updateOne(Tour);

//Aggregation
const getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          // _id:null,
          // _id:'difficulty',
          _id: { $toUpper: 'difficulty' },
          numRatings: { $sum: '$ratingQuantity' },
          numTours: { $sum: 1 },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      {
        $match: { _id: { $ne: 'EASY' } },
      },
    ]);

    res.status(200).json({
      status: 'Success',
      data: stats,
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err.message,
    });
  }
};
const getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: newDate(`${year}-01-01`),
            $lte: newDate(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $add: 1 },
          tour: { $push: '$name' },
        },
      },
      {
        $addFields: { $month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      // {
      //   $limit:6
      // }
    ]);
    res.status(204).json({
      status: 'Success',
      data: plan,
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err.message,
    });
  }
};

const getAllToursWithIn = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat && !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
    const tours = await Tour.find({
      startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });
    res.status(200).json({
      status: 'Success',
      results: tours.length,
      data: tours,
    });
  }
});
const getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat && !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: 0.001,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  res.status(200).json({
    status: 'Success',
    data: distances,
  });
});

module.exports = {
  getAllTours,
  getSingleTour,
  createTour,
  deleteTour,
  updateTour,
  aliasTopTour,
  getTourStats,
  getMonthlyPlan,
  getAllToursWithIn,
  getDistances,
};
