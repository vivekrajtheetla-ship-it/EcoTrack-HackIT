const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/leaderboard
// @desc    Get top 10 users by eco-points
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Get users with points, sorted by points descending
    const users = await User.find({ points: { $gt: 0 } })
      .select('email points')
      .sort({ points: -1 })
      .limit(10);

    // Format leaderboard data
    const leaderboard = users.map((user, index) => ({
      name: user.email.split('@')[0], // Use email username as display name
      points: user.points,
      rank: index + 1,
      userId: user._id
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;