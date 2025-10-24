const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Activity = require('../models/Activity');

// @route   GET /api/admin/database
// @desc    Get all database data for viewing
// @access  Public (for development only)
router.get('/database', async (req, res) => {
  try {
    // Get all users (without password hashes)
    const users = await User.find({}).select('-passwordHash').sort({ createdAt: -1 });
    
    // Get all activities with user information
    const activities = await Activity.find({})
      .populate('userId', 'email')
      .sort({ timestamp: -1 });

    // Get database statistics
    const stats = {
      totalUsers: await User.countDocuments(),
      totalActivities: await Activity.countDocuments(),
      totalPoints: await User.aggregate([
        { $group: { _id: null, total: { $sum: '$points' } } }
      ]),
      totalCarbonSaved: await Activity.aggregate([
        { $group: { _id: null, total: { $sum: '$carbon_kg' } } }
      ])
    };

    res.json({
      stats,
      users,
      activities,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Database viewer error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Public (for development only)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Users fetch error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   GET /api/admin/activities
// @desc    Get all activities
// @access  Public (for development only)
router.get('/activities', async (req, res) => {
  try {
    const activities = await Activity.find({})
      .populate('userId', 'email')
      .sort({ timestamp: -1 });
    res.json(activities);
  } catch (err) {
    console.error('Activities fetch error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   DELETE /api/admin/reset
// @desc    Reset all database data (for development only)
// @access  Public (for development only)
router.delete('/reset', async (req, res) => {
  try {
    await User.deleteMany({});
    await Activity.deleteMany({});
    
    res.json({ 
      message: 'Database reset successfully',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Database reset error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;