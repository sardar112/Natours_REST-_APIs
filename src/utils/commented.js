//All the commented code goes here
//TOUR FUNCTIONS

// async (req, res) => {
//   try {
//     //populate create 2 queries, can b effect on perormance for the large scale app
//     // const tour = await Tour.findById(req.params.id); old query
//     // const tour = await Tour.findById(req.params.id).populate('guides '); simple populate
//     //excluding -v and passwordChangeAt prperty from the document
//     // to avoid the duplication in single and  getalltours we have created query middlware for population in the  tour model
//     // const tour = await Tour.findById(req.params.id).populate({
//     //   path: 'guides',
//     //   select: '-_v -passwordChangeAt',
//     // });
//     //populate("reviews") to get reviews in singletour
//     const tour = await Tour.findById(req.params.id).populate('reviews');
//     res.status(200).json({
//       status: 'Success',
//       data: tour,
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'Fail',
//       message: err.message,
//     });
//   }
// };
// async (req, res) => {
//   try {
//     const features = new APIFeatures(Tour.find(), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .pagination();
//     const tours = await features.query;
//     // const query = Tour.find();
//     // const allTours = await query;
//     res.status(200).json({
//       status: 'Success',
//       data: tours,
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'Fail',
//       message: err.message,
//     });
//   }
// };
// async (req, res) => {
//   try {
//     const newTour = await Tour.create({ ...req.body });
//     res.json({
//       status: 'Success',
//       message: 'Tour created successfully',
//       data: newTour,
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'Fail',
//       message: err.message,
//     });
//   }
// };

//use factory functions instead of  using the duplication
// async (req, res) => {
//   try {
//     const tour = await Tour.findByIdAndDelete(req.params.id);
//     res.status(204).json({
//       status: 'Success',
//       message: 'Tour deleted successfully',
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'Fail',
//       message: err.message,
//     });
//   }
// };
// catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!tour) return next(AppError('No tour found with that Id', 404));
//   const result = await res.json({
//     status: 200,
//     message: 'Tour updated successfully',
//     data: tour,
//   });
// });
//*********************************************************************************** */
//REVIEW FUNCTIONS

// const createRiview = catchAsync(async (req, res) => {
//   //Allowing nested routes
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user.id;

//   const newRewview = await Review.create(req.body);
//   res.status(201).json({
//     status: 'Success',
//     message: 'Review created successfully',
//     data: newRewview,
//   });
// });

//Instead of  this use factory function
// const getAllReviews = catchAsync(async (req, res) => {
//   let filter = {};
//   if (req.params.tourId) filter.tourId = { tour: req.params.tourId };
//   const reviews = await Review.find(filter);
//   res.status(200).json({
//     status: 'Success',
//     results: reviews.length,
//     data: reviews,
//   });
// });

//*********************************************************************************** */
//Tour FUNCTIONS
