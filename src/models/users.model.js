const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    minLength: 5,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  kakaoId: {
    type: String,
    unique: true,
    sparse: true,
  },
});

const saltRounds = 10;
userSchema.pre('save', function (next) {
  let user = this;

  if (user.isModified('password')) {
    // generate a salt
    bcrypt.genSalt(saltRounds, function (error, salt) {
      if (error) return next(error);

      bcrypt.hash(user.password, salt, function (error, hash) {
        if (error) return next(error);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, function (error, isMatch) {
    if (error) return callback(error);
    callback(null, isMatch);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
