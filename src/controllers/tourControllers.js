const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

//Aliasing thisnis only for when most used route is needed .ie user wants five best cheep things
const aliasTopTour = (req, res, next) => {
  req.query.limit = '5';
  //   req.query.sort = "-property,proprty"
  req.query.sort = '-name';
  req.query.fields = 'name,price,summary,difficulty';
  next();
};

const getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const tours = await features.query;
    // const query = Tour.find();
    // const allTours = await query;
    if (allTours.length) {
      res.status(200).json({
        status: 'Success',
        data: tours,
      });
    } else {
      res.status(400).json({
        status: 'Fail',
        message: 'Could not find tours',
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err.message,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create({ ...req.body });
    if (newTour) {
      res.json({
        status: 'Success',
        message: 'Tour created successfully',
        data: newTour,
      });
    } else {
      res.status(400).json({
        status: 'Fail',
        message: 'Coud not create tour',
      });
    }
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err.message,
    });
  }
};

const getSingleTour = async (req, res) => {
  try {
    //populate create 2 queries, can b effect on perormance for the large scale app
    // const tour = await Tour.findById(req.params.id); old query
    // const tour = await Tour.findById(req.params.id).populate('guides '); simple populate
    //excluding -v and passwordChangeAt prperty from the document
    // to avoid the duplication in single and  getalltours we have created query middlware for population in the  tour model
    // const tour = await Tour.findById(req.params.id).populate({
    //   path: 'guides',
    //   select: '-_v -passwordChangeAt',
    // });
    const tour = await Tour.findById(req.params.id);
    if (tour) {
      res.status(200).json({
        status: 'Success',
        data: tour,
      });
    } else {
      res.status(400).json({
        status: 'Fail',
        message: 'Could not find tour',
      });
    }
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err.message,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (tour) {
      res.status(204).json({
        status: 'Success',
        message: 'Tour deleted successfully',
      });
    } else {
      res.status(400).json({
        status: 'Fail',
        message: 'Could not find tours',
      });
    }
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err.message,
    });
  }
};

const editTour = async (req, res) => {
  const result = await res.json({
    status: 200,
    message: 'Hello editTour',
  });
};

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
          maxcPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      {
        $match: { _id: { $ne: 'EASY' } },
      },
    ]);

    if (stats) {
      res.status(200).json({
        status: 'Success',
        data: stats,
      });
    } else {
      res.status(400).json({
        status: 'Fail',
        message: 'Could not find stats',
      });
    }
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
    if (plan) {
      res.status(204).json({
        status: 'Success',
        data: plan,
      });
    } else {
      res.status(400).json({
        status: 'Fail',
        message: 'Could not find tours',
      });
    }
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err.message,
    });
  }
};

module.exports = {
  getAllTours,
  getSingleTour,
  createTour,
  deleteTour,
  editTour,
  aliasTopTour,
  getTourStats,
  getMonthlyPlan,
};
