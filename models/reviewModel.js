import mongoose from 'mongoose';
import Tour from './tourModel.js';

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
      maxLength: [500, 'Reviews can not be more than 500 characters'],
    },
    rating: {
      type: Number,
      min: [0, 'Ratings can not be bolow 0!'],
      max: [5, 'Ratings can not be more than 5!'],
    },
    CreatedAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour!'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user!'],
    },
  },
  {
    // allows virtuals to show up in outputs
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ensures that each user can only create 1 review per tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  // .populate({
  //   path: 'tour',
  //   select: 'name',
  // });

  next();
});

// Static Method - this points to the model
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      // includes only reviews where the tour field matches the tour ID
      $match: { tour: tourId },
    },
    {
      // To calculate the stats
      // Always needs _id field - common field to group by
      $group: {
        _id: '$tour',
        // Adds 1 for every entry (counts)
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// Call the stats static method every time a new review is created (Saved)
reviewSchema.post('save', function (docs) {
  // this point to the current review
  // constructor points to the Model that is creating the review
  // this. tour is the tour field, which is the ID
  this.constructor.calcAverageRatings(this.tour);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // this points to the current query
  // we pass data from pre to post
  // must clone the query

  const query = this.clone();
  this.r = await query.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // post middleware still gets access to the query with this
  if (this.r) await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
