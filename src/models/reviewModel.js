const mongoose = require('mongoose');
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

//populating tour and user
tourSchema.pre(/^find/, function (next) {
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
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
