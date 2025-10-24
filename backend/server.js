require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const activityRoutes = require('./routes/activities');
const leaderboardRoutes = require('./routes/leaderboard');
const adminRoutes = require('./routes/admin');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Configuration (add this)
const allowedOrigins = [
  'https://ecotrack-hackit.netlify.app', // your Netlify frontend URL
  'http://localhost:3000'                // for local testing
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecotrack')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('EcoTrack API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
