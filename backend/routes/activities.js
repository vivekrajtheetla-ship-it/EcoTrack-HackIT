const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Activity = require('../models/Activity');
const User = require('../models/User');

// Carbon emission factors (matching frontend)
const EMISSION_FACTORS = {
  transport: {
    'Sedan': 0.2,
    'SUV': 0.3,
    'Motorbike': 0.1
  },
  energy: 0.4, // kg CO2 per kWh
  food: {
    'High Meat': 5.0,
    'Low Meat': 3.0,
    'Vegetarian': 1.5,
    'Vegan': 0.5
  }
};

// Calculate carbon emissions and points
const calculateEmissions = (type, data) => {
  let carbon_kg = 0;

  switch (type) {
    case 'transport':
      carbon_kg = EMISSION_FACTORS.transport[data.vehicleType] * parseFloat(data.distance || 0);
      break;
    case 'energy':
      carbon_kg = EMISSION_FACTORS.energy * parseFloat(data.electricity || 0);
      break;
    case 'food':
      carbon_kg = EMISSION_FACTORS.food[data.mealType];
      break;
    default:
      carbon_kg = 0;
  }

  // Calculate eco-points (10 points per kg reduced)
  const points = Math.round(carbon_kg * 10);

  return { carbon_kg: parseFloat(carbon_kg.toFixed(2)), points };
};

// @route   POST /api/activities
// @desc    Log a new activity
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { type, data } = req.body;
    
    // Validate input
    if (!type || !['transport', 'energy', 'food'].includes(type)) {
      return res.status(400).json({ message: 'Invalid activity type' });
    }
    
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ message: 'Activity data is required' });
    }

    // Calculate emissions and points
    const { carbon_kg, points } = calculateEmissions(type, data);
    
    if (carbon_kg <= 0) {
      return res.status(400).json({ message: 'Invalid activity data' });
    }

    // Create and save activity
    const activity = new Activity({
      userId: req.user.id,
      type,
      data,
      carbon_kg,
      points,
      category: type.charAt(0).toUpperCase() + type.slice(1)
    });

    await activity.save();

    // Update user points
    await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { points: points } }
    );

    res.status(201).json(activity);
  } catch (err) {
    console.error('Activity logging error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/activities/me
// @desc    Get all activities for current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const activities = await Activity.find({
      userId: req.user.id
    }).sort({ timestamp: -1 });

    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;