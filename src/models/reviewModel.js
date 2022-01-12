const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    reviewe: {
      type: String,
      required: [true, 'Review can nott be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 3,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user'],
    },
  },
  { toJson: { virtuals: true }, toObject: { virtuals: true } }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

//populating tour and user
reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: '-_v  name',
  // }).populate({
  //   path: 'user',
  //   select: '-_v  name photo',
  // });
  //just turn off one populate if there is no need
  this.populate({
    path: 'user',
    select: '-_v  name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length) {
    await Tour.findByIdAndUpdate(
      tourId,
      {
        ratingsQuantity: stats[0].nRatings,
        ratingsAverage: stats[0].avgRating,
      },
      { new: true }
    );
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};
reviewSchema.post('save', function () {
  //This points to the current review
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findByIdAnd/, async function (next) {
  const r = await this.findOne();
  next();
});
reviewSchema.post(/^findByIdAnd/, async function () {
  // this.findOne(); does not wprk here bcz the query  has already  executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
