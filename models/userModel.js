import mongoose from 'mongoose';
import slugify from 'slugify';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name.'],
    // validate: {
    //   validator: function (val) {
    //     return validator.isAlpha(val, 'en-US', { ignore: /( |'|\d)/g });
    //   },
    //   message: 'User names can only contain characters.',
    // },
    minlength: [5, 'User names must contain at least 5 characters.'],
    maxlength: [25, 'User names can not contain more than 25 characters.'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email address.'],
    unique: [
      true,
      'An account with the same email already exists.  Log in instead!',
    ],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address.'],
    minlength: [5, 'Email addresses must contain at least 5 characters.'],
    maxlength: [30, 'Email addresses can not contain more than 30 characters.'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [8, 'Passwords must contain at least 5 characters.'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    minlength: [8, 'Passwords must contain at least 5 characters.'],
    validate: {
      // only works with save and create, not with update
      validator: function (val) {
        return val === this.password;
      },
      message: 'The passwords do not match!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    // hides from API
    select: false,
  },
});

// middleware

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  // must sub 1s in case saving to DB is slower than issuing token
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
// regEx - all that start with "^" "find"
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // use between 10-14
  this.password = await bcrypt.hash(this.password, 14);

  // remove the confirmation password
  this.passwordConfirm = undefined;
  next();
});

// instance methods - this points to the doc
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // 2nd arg is hashed value of 1st - order matters!!
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
