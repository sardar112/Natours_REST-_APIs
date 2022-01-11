const mongoose = require('mongoose');
const User = require('./userModel');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'A tour must have a name'],
    },
    ratingsAverage: {
      type: Number,
      default: 3.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, //4.666666=>4.7
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour  must have a price'],
    },
    priceDiscount: {
      type: Number,
    },
    duration: {
      type: Number,
      required: [true, 'A tour  must have duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have  group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy,medium,difficult',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    imageCover: [String],
    secreteTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Pointer'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Pointer'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // guides: Array,  embedding the document
    //refrencing the user document and it will be an child refrencing
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  { toJson: { virtuals: true }, toObject: { virtuals: true } }
);

// tourSchema.index({ price: 1 });single

/*it will EXAMIN  the only documents that have the exact value .
 wihich is more efficientfor performance we only apply indexes on that most queried field 
 index are more powerful  and efficient for  reading the  data from the database.
 */
tourSchema.index({ price: 1, ratingsAverage: -1 }); //compound indexing
tourSchema.index({ startLocation: '2dsphere' }); //compound indexing

//embedding the user document  and adding to the tour and fecthing the user document
tourSchema.pre('save', async function (next) {
  const guidesPromises = await this.guides.map((id) => User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  next();
});
//VIRTUAL MIDDLEWARE
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
//virtual populate
tourSchema
  .virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id',
  })
  .get(function () {
    return this.duration / 7;
  });
//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.find({ secreteTour: { $ne: true } });
  next();
});
//avoiding duplication of populate
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-_v -passwordChangeAt',
  });
  next();
});
// tourSchema.post(/^find/, function (docs,next) {
//   this.find({ secreteTour: { $ne: true } });
//   next();
// });
//Aggregation MIDDLEWARE
//it will not run bcz of geoNear . it  create index
// tourSchema.pre('aggregate', function (next) {
//   this.pipeLine.unshift({ $match: { secreteTour: { $ne: true } } });
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
