const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['transport', 'energy', 'food'],
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  carbon_kg: {
    type: Number,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  date: {
    type: String,
    default: function() {
      return new Date().toLocaleDateString();
    }
  }
});

module.exports = mongoose.model('Activity', ActivitySchema);