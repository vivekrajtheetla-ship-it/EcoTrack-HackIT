# EcoTrack MERN Stack Implementation Guide

## 🚀 Complete MERN Stack with JWT Authentication & MongoDB

### Architecture Overview
- **Frontend**: React with Hooks, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express.js, MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: MongoDB with user-specific data isolation

## 🔧 Backend Implementation

### 1. Database Models

#### User Model (`backend/models/User.js`)
```javascript
{
  email: String (unique, required),
  passwordHash: String (required),
  points: Number (default: 0),
  target_kg: Number (default: 50),
  createdAt: Date (default: now)
}
```

#### Activity Model (`backend/models/Activity.js`)
```javascript
{
  userId: ObjectId (ref: User, required),
  type: String (enum: ['transport', 'energy', 'food']),
  data: Mixed (activity-specific data),
  carbon_kg: Number (calculated emission),
  points: Number (earned points),
  category: String (display category),
  timestamp: Date (default: now),
  date: String (formatted date)
}
```

### 2. API Endpoints

#### Authentication Routes (`/api/auth`)
- `POST /register` - User registration with email/password
- `POST /login` - User login, returns JWT token
- `GET /me` - Get current user profile (protected)
- `PUT /goal` - Update user's carbon goal (protected)

#### Activity Routes (`/api/activities`)
- `POST /` - Log new activity (protected)
- `GET /me` - Get user's activities (protected)

#### Leaderboard Routes (`/api/leaderboard`)
- `GET /` - Get top users by points (public)

### 3. JWT Authentication Middleware
- Validates JWT tokens in `x-auth-token` header
- Extracts user ID for protected routes
- Automatic token expiration handling

## 🎨 Frontend Implementation

### 1. API Service Layer (`frontend/src/services/api.js`)
- Centralized API communication
- Automatic JWT token management
- Error handling and token refresh
- Local storage integration

### 2. State Management
- React useReducer for global state
- JWT token persistence
- Real-time data synchronization
- Loading and error states

### 3. User-Specific Features
- **Personal Dashboard**: User's own activities and progress
- **Activity Logging**: Real-time carbon calculation and point earning
- **Goal Setting**: Personal carbon reduction targets
- **Leaderboard**: Global ranking with user highlighting

## 🔒 Security Features

### 1. JWT Implementation
- 7-day token expiration
- Secure token storage in localStorage
- Automatic logout on token expiration
- Protected route middleware

### 2. Data Isolation
- User-specific activity queries
- MongoDB ObjectId relationships
- Secure user identification
- No cross-user data access

### 3. Input Validation
- Frontend form validation
- Backend data sanitization
- Type checking and constraints
- Error message handling

## 🗄️ Database Configuration

### MongoDB Setup
```bash
# Local MongoDB (default)
MONGODB_URI=mongodb://localhost:27017/ecotrack

# MongoDB Atlas (production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecotrack
```

### Environment Variables

#### Backend (`.env`)
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/ecotrack
JWT_SECRET=your_secure_jwt_secret_key
```

#### Frontend (`.env`)
```
REACT_APP_API_URL=http://localhost:5001/api
```

## 🚀 Running the Application

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 3. MongoDB Setup
- Install MongoDB locally OR use MongoDB Atlas
- Ensure MongoDB is running on default port 27017
- Database and collections are created automatically

## 📊 Data Flow

### 1. User Registration/Login
1. User submits credentials
2. Backend validates and creates JWT
3. Frontend stores token in localStorage
4. Subsequent requests include token in headers

### 2. Activity Logging
1. User fills activity form
2. Frontend calculates emissions preview
3. API call creates activity in database
4. User points updated automatically
5. Leaderboard refreshed

### 3. Dashboard Data Loading
1. User authentication verified
2. Profile data loaded from `/api/auth/me`
3. Activities loaded from `/api/activities/me`
4. Leaderboard loaded from `/api/leaderboard`
5. Real-time chart generation

## 🎯 Key Features Implemented

### ✅ User Authentication
- Secure registration and login
- JWT token management
- Automatic session handling
- Protected routes

### ✅ Personal Data Management
- User-specific activity tracking
- Individual carbon footprint calculation
- Personal goal setting and progress
- Private activity history

### ✅ Real-time Calculations
- Dynamic carbon emission calculations
- Automatic point earning system
- Live chart updates
- Progress tracking

### ✅ Social Features
- Global leaderboard
- User ranking system
- Social sharing integration
- Community comparison

### ✅ Data Persistence
- MongoDB integration
- Automatic data synchronization
- Offline capability preparation
- Data backup and recovery

## 🔧 Customization Options

### Carbon Emission Factors
Modify `EMISSION_FACTORS` in both frontend and backend:
```javascript
const EMISSION_FACTORS = {
  transport: {
    'Sedan': 0.2,      // kg CO2 per km
    'SUV': 0.3,
    'Motorbike': 0.1
  },
  energy: 0.4,         // kg CO2 per kWh
  food: {
    'High Meat': 5.0,  // kg CO2 per meal
    'Low Meat': 3.0,
    'Vegetarian': 1.5,
    'Vegan': 0.5
  }
};
```

### Points System
Modify point calculation in `backend/routes/activities.js`:
```javascript
const points = Math.round(carbon_kg * 10); // 10 points per kg CO2
```

## 🚀 Production Deployment

### Backend Deployment
1. Set production environment variables
2. Use MongoDB Atlas for database
3. Deploy to Heroku, AWS, or similar
4. Configure CORS for frontend domain

### Frontend Deployment
1. Update `REACT_APP_API_URL` to production backend
2. Build production bundle: `npm run build`
3. Deploy to Netlify, Vercel, or similar
4. Configure environment variables

## 🔍 Testing the Implementation

### 1. User Registration
- Create new account with email/password
- Verify JWT token storage
- Check user profile creation

### 2. Activity Logging
- Log transport, energy, and food activities
- Verify carbon calculations
- Check point accumulation

### 3. Data Persistence
- Refresh browser and verify data persistence
- Check MongoDB collections
- Verify user-specific data isolation

### 4. Leaderboard
- Create multiple users
- Log activities for different users
- Verify leaderboard ranking

## 🎉 Success Metrics

The implementation successfully provides:
- ✅ Secure user authentication with JWT
- ✅ User-specific data isolation
- ✅ Real-time carbon footprint tracking
- ✅ MongoDB integration with proper schemas
- ✅ Responsive React frontend
- ✅ RESTful API architecture
- ✅ Production-ready code structure

## 🔧 Next Steps

1. **Enhanced Security**: Add rate limiting, input sanitization
2. **Advanced Features**: Email verification, password reset
3. **Analytics**: Advanced reporting and insights
4. **Mobile App**: React Native implementation
5. **AI Integration**: Smart recommendations and predictions