import mongoose from 'mongoose';
import slugify from 'slugify';
import validator from 'validator';
// import User from './userModel.mjs';

// Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name can have a max of 40 characters'],
      minlength: [10, 'A tour name must have at least 10 characters'],
      validate: {
        validator: function (val) {
          return validator.isAlpha(val, 'en-US', { ignore: /( |'|\d)/g });
        },
        message: 'The tour name can only contain characters.',
      },
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A group must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: " Difficulty must be either 'easy', 'medium' or 'difficult'",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [0, 'Ratings must have a positive number'], // also works with Dates
      max: [5, 'Rating can not be more than 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc when creating a new document. Won't work on update!
          return val < this.price;
        },
        message:
          'The discounted price ({VALUE}) must be lower than the original price!',
      },
    },
    summary: {
      type: String,
      trim: true, // removes all white space in beginning and end
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // removes from results
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON - must have "type" and "coordinates"
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      // lng, lat
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // guides: Array, // for embedded
    guides: [
      {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'User',
      },
    ],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
// tells Mongo that startLocation should be indexed to a 2d sphere
tourSchema.index({ startLocation: '2dsphere' });

// VIRTUAL MIDDLEWARE
// Virtual properties - must set options above
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// virtual populate - sets the array of reviews to the tour without actually persisting it o the database
tourSchema.virtual('reviews', {
  ref: 'Review',
  // name of field in the other model where tourID is referenced
  foreignField: 'tour',
  // name of field where ID is referenced
  localField: '_id',
});

// DOCUMENT MIDDLEWARE: 'save' hook runs before "save()" and "create()"

// "this" points to the whole document
// "pre" "save" hook
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// embed user document in Tours for guides ::151
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// Post Middleware gets "doc" but not "this"
// tourSchema.post('save', function (doc, next) {
//   next();
// });

// QUERY MIDDLEWARE: runs before "find"

//"this" points to the current query
// this is a regular object so you can set whatever property you want on it
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

// populate will create a new query to get the users - will affect performance
// must reference in the mod
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

// post find hook gets access to the returned docs
// tourSchema.post(/^find/, function (docs) {
//   console.log(`The query took ${Date.now() - this.start} milliseconds!`);
// });

// AGGREGATION MIDDLEWARE
// "this" points to the current aggregation object
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline());
//   next();
// });

// Model
const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
