# EcoTrack V2.0 - Complete Carbon Footprint Tracking Application

EcoTrack is a comprehensive carbon footprint tracking application with a completely refactored V2.0 frontend featuring modern UI/UX, gamification, and innovative sustainability features. The V2.0 frontend is a standalone, deployable React application with mock data integration.

## 🚀 Quick Start Options

### Option 1: EcoTrack V2.0 Frontend Only (Recommended for Demo)
```bash
cd frontend
npm install
npm start
```
Visit http://localhost:3000 to experience the new V2.0 interface!

### Option 2: Full Stack (Backend + Frontend V2.0)
```bash
# Terminal 1 - Backend
cd backend && npm install && npm start

# Terminal 2 - Frontend V2.0
cd frontend && npm install && npm start
```

## ✨ EcoTrack V2.0 Features

### 🎨 Completely Refactored Frontend
- **Single-file component architecture** in `frontend/src/App.js`
- **Modern authentication landing page** with compelling visuals
- **Responsive design** with Tailwind CSS and Lucide React icons
- **Mock data integration** for immediate deployment

### 🔐 Enhanced Authentication Experience
- **Visual landing page** with nature-inspired green theme
- **Prominent EcoTrack branding** with leaf icon
- **Dual CTA buttons**: Login and Create Account
- **About section** showcasing 4 key value propositions

### 📊 Advanced Dashboard Features
- **Real-time Eco-Points display** (starts at 245 points)
- **Weather-based recommendations** with contextual tips
- **Carbon footprint comparator** showing regional averages
- **Social sharing integration** with platform buttons

### 🌤️ Innovation 1: Smart Weather Widget
- **Mock weather API** simulation (Sunny 25°C or Rainy 15°C)
- **Contextual recommendations** based on weather conditions
- **Dynamic point rewards** for weather-appropriate actions

### 📈 Innovation 2: Carbon Footprint Comparator
- **Regional comparison metrics** with visual indicators
- **Mock performance data** vs. national/neighborhood averages
- **Color-coded status indicators** for quick understanding

### 📚 New Resource Hub
- **Dedicated navigation** with BookOpen icon
- **Sustainable Living Library**: 4 color-coded educational cards
- **External Resources**: Mock document links (PDF guides, tools)
- **Community & Advocacy**: Engagement and local group information

### 🎯 Gamification & Social Features
- **Daily recommendations** with point values and icons
- **Social sharing bar** with Twitter, Facebook, and general share
- **Console logging** for share actions with current points
- **Achievement-ready architecture** for future expansions

## Legacy Features (Backend Integration Available)

- **User Authentication**: Secure registration and login system
- **Activity Tracking**: Log transportation, energy usage, and meals
- **AI-Powered Meal Analysis**: Gemini AI integration to analyze carbon footprint of meals
- **Dashboard**: Visualize your carbon footprint with interactive charts
- **Leaderboard**: Compete with others to reduce your environmental impact
- **Personalized Recommendations**: Get tips to reduce your carbon footprint

## Tech Stack

- **Frontend**: React, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: Google Gemini API

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Google Gemini API key

## 📦 V2.0 Deployment (Production Ready)

### Quick Deployment
```bash
cd frontend
npm install
npm run build
npm run serve  # Local testing of production build
```

### Platform Deployment
```bash
# Netlify
npm run deploy:netlify

# Vercel
npm run deploy:vercel

# Manual: Upload 'build' folder to any static host
```

## 🛠 Legacy Installation (Full Stack)

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/ecotrack.git
cd ecotrack
```

2. **Install dependencies**

```bash
npm run install:all
```

3. **Configure environment variables**

Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecotrack
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

4. **Start the application**

Development mode (with hot reloading for backend):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## 🎮 V2.0 Usage Experience

### Authentication Flow
1. **Landing Page**: Beautiful green-themed welcome screen
2. **Login/Register**: Click CTAs to access simple forms
3. **Instant Access**: Simulated authentication for immediate demo

### Dashboard Experience
1. **Weather Widget**: See contextual recommendations based on mock weather
2. **Daily Tips**: 4 actionable recommendations with Eco-Points
3. **Comparator**: View your carbon footprint vs. regional averages
4. **Social Sharing**: Share progress on social platforms (console logged)

### Resource Hub
1. **Navigate**: Click "Resources" in the top navigation
2. **Explore**: Browse sustainable living tips and external resources
3. **Community**: Learn about local eco-group involvement

### Legacy Usage (Full Stack)
1. Register a new account or login
2. Log your daily activities (transportation, energy usage, meals)
3. View your carbon footprint on the dashboard
4. Check the leaderboard to see how you compare to others
5. Follow personalized recommendations to reduce your impact

## Deployment

### Backend Deployment (Render, Heroku, or similar)

1. Create a new web service
2. Connect your GitHub repository
3. Set environment variables (PORT, MONGODB_URI, JWT_SECRET, GEMINI_API_KEY)
4. Deploy with the build command: `npm install`
5. Set the start command: `npm start`

### Frontend Deployment (Netlify, Vercel, or similar)

1. Connect your GitHub repository
2. Set the build command: `cd frontend && npm install && npm run build`
3. Set the publish directory: `frontend/build`
4. Add environment variable: `REACT_APP_API_URL=your_backend_url`

## Project Structure

```
ecotrack/
├── backend/               # Backend server code
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   ├── .env               # Environment variables
│   ├── package.json       # Backend dependencies
│   └── server.js          # Server entry point
├── frontend/              # React frontend
│   ├── public/            # Static files
│   ├── src/               # React source code
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   ├── App.js         # Main App component
│   │   └── index.js       # React entry point
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind CSS config
└── package.json           # Root package.json for scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Gemini AI](https://ai.google.dev/) for meal carbon footprint analysis
- [Chart.js](https://www.chartjs.org/) for data visualization
- [Tailwind CSS](https://tailwindcss.com/) for styling