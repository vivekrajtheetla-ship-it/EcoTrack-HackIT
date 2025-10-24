const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 0
  },
  target_kg: {
    type: Number,
    default: 50
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.passwordHash);
};

// Method to get user profile data
UserSchema.methods.getProfile = function() {
  return {
    id: this._id,
    email: this.email,
    points: this.points,
    target_kg: this.target_kg,
    registered_on: this.createdAt
  };
};

module.exports = mongoose.model('User', UserSchema);