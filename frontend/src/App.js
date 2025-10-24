import React, { useState, useReducer, useEffect } from 'react';
import { BookOpen, Home, Leaf, Twitter, Linkedin, Share2, TrendingUp, Award, Zap, Car, Lightbulb, UtensilsCrossed, Plus, Target } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { authAPI, activitiesAPI, leaderboardAPI, isAuthenticated } from './services/api';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
  </div>
);

// Error Component
const ErrorMessage = ({ message, onDismiss }) => (
  <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center justify-between">
    <span>{message}</span>
    {onDismiss && (
      <button
        onClick={onDismiss}
        className="ml-4 text-red-500 hover:text-red-700"
      >
        ×
      </button>
    )}
  </div>
);

// Initial state for the app
const initialState = {
  isAuthenticated: isAuthenticated(),
  currentView: 'dashboard', // 'dashboard', 'resources', 'activities'
  authMode: 'idle', // 'idle', 'login', 'register'
  user: {
    id: '',
    email: '',
    points: 0,
    target_kg: 50,
    registered_on: ''
  },
  activities: [],
  weatherData: { condition: 'Sunny', temp: '25°C' },
  leaderboard: [],
  loading: false,
  error: null
};

// Reducer for state management
const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'TOGGLE_AUTH':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_AUTH_MODE':
      return { ...state, authMode: action.payload };
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_ACTIVITIES':
      return { ...state, activities: action.payload };
    case 'ADD_ACTIVITY':
      return { 
        ...state, 
        activities: [action.payload, ...state.activities],
        user: { ...state.user, points: state.user.points + action.payload.points }
      };
    case 'SET_LEADERBOARD':
      return { ...state, leaderboard: action.payload };
    case 'SET_WEATHER':
      return { ...state, weatherData: action.payload };
    case 'UPDATE_USER_GOAL':
      return { ...state, user: { ...state.user, target_kg: action.payload } };
    case 'LOGOUT':
      authAPI.logout();
      return {
        ...initialState,
        isAuthenticated: false,
        weatherData: state.weatherData
      };
    default:
      return state;
  }
};

// Mock weather data generator
const generateWeatherData = () => {
  const conditions = [
    { condition: 'Sunny', temp: '25°C' },
    { condition: 'Rainy', temp: '15°C' }
  ];
  return conditions[Math.floor(Math.random() * conditions.length)];
};

// Carbon emission factors
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

// AuthLandingPage Component
const AuthLandingPage = ({ state, dispatch }) => {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    
    try {
      await authAPI.login(formData.email, formData.password);
      const userProfile = await authAPI.getProfile();
      
      dispatch({ type: 'SET_USER', payload: userProfile });
      dispatch({ type: 'TOGGLE_AUTH', payload: true });
      dispatch({ type: 'SET_AUTH_MODE', payload: 'idle' });
      setError('');
    } catch (error) {
      setError(error.message);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    
    try {
      await authAPI.register(formData.email, formData.password);
      setError('');
      dispatch({ type: 'SET_AUTH_MODE', payload: 'login' });
      setFormData({ email: formData.email, password: '', confirmPassword: '' });
      // Show success message
      setError('Registration successful! Please log in.');
    } catch (error) {
      setError(error.message);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  if (state.authMode === 'login' || state.authMode === 'register') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white opacity-5 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white opacity-10 rounded-full animate-ping"></div>
        </div>

        <div className="max-w-md w-full bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 relative z-10 transform hover:scale-105 transition-all duration-300">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mb-4 shadow-lg">
              <Leaf className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              {state.authMode === 'login' ? 'Welcome Back!' : 'Join EcoTrack'}
            </h2>
            <p className="text-gray-600 text-sm">
              {state.authMode === 'login' 
                ? 'Continue your sustainable journey' 
                : 'Start your eco-friendly adventure today'
              }
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-lg animate-shake">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-red-400">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={state.authMode === 'login' ? handleLogin : handleRegister} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300 bg-gray-50 focus:bg-white"
                    placeholder="your@email.com"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">📧</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300 bg-gray-50 focus:bg-white"
                    placeholder="••••••••"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">🔒</span>
                  </div>
                </div>
              </div>

              {state.authMode === 'register' && (
                <div className="relative animate-fadeIn">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300 bg-gray-50 focus:bg-white"
                      placeholder="••••••••"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-lg">🔐</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={state.loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {state.loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{state.authMode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <span className="text-lg">🚀</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => dispatch({ type: 'SET_AUTH_MODE', payload: 'idle' })}
              className="text-emerald-600 hover:text-emerald-700 font-medium transition duration-200 flex items-center justify-center space-x-2 mx-auto"
            >
              <span>←</span>
              <span>Back to main page</span>
            </button>
          </div>

          {/* Switch between login/register */}
          <div className="mt-6 text-center border-t pt-6">
            <p className="text-gray-600 text-sm">
              {state.authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              onClick={() => dispatch({ 
                type: 'SET_AUTH_MODE', 
                payload: state.authMode === 'login' ? 'register' : 'login' 
              })}
              className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm mt-1 transition duration-200"
            >
              {state.authMode === 'login' ? 'Create Account' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white opacity-5 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-white opacity-5 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-white opacity-5 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-white opacity-5 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-7xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-16">
            {/* Animated Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-white rounded-full p-6 shadow-2xl transform hover:scale-110 transition-all duration-500">
                  <Leaf className="w-20 h-20 text-emerald-600 animate-bounce" />
                </div>
              </div>
            </div>

            {/* Main Title with Gradient */}
            <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-white mb-6 tracking-tight animate-fadeIn">
              EcoTrack
            </h1>
            
            {/* Subtitle with Animation */}
            <div className="mb-8">
              <p className="text-2xl md:text-3xl text-white font-light mb-4 animate-slideUp">
                Your Personal Carbon Footprint Companion
              </p>
              <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto animate-slideUp">
                Join thousands of eco-warriors tracking, reducing, and making a real impact on our planet 🌍
              </p>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button
                onClick={() => dispatch({ type: 'SET_AUTH_MODE', payload: 'login' })}
                className="group bg-white text-emerald-600 font-bold py-5 px-10 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 min-w-[220px] border-4 border-transparent hover:border-emerald-200"
              >
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-lg">Sign In</span>
                  <span className="text-2xl group-hover:animate-bounce">🚀</span>
                </div>
              </button>
              
              <button
                onClick={() => dispatch({ type: 'SET_AUTH_MODE', payload: 'register' })}
                className="group bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-5 px-10 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 min-w-[220px] border-4 border-emerald-400 hover:border-emerald-300"
              >
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-lg">Start Your Journey</span>
                  <span className="text-2xl group-hover:animate-pulse">🌱</span>
                </div>
              </button>
            </div>
          </div>

          {/* Enhanced Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-white">
            <div className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="text-5xl mb-4 group-hover:animate-bounce">🌱</div>
              <h3 className="text-xl font-bold mb-3 text-white">Smart Tracking</h3>
              <p className="text-emerald-100 text-sm leading-relaxed">
                Effortlessly monitor your daily transportation, energy consumption, and dietary choices with our intuitive interface
              </p>
              <div className="mt-4 flex items-center text-emerald-200 text-xs">
                <span className="mr-2">✨</span>
                <span>Real-time calculations</span>
              </div>
            </div>

            <div className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="text-5xl mb-4 group-hover:animate-spin">🤖</div>
              <h3 className="text-xl font-bold mb-3 text-white">AI Insights</h3>
              <p className="text-emerald-100 text-sm leading-relaxed">
                Get personalized recommendations powered by advanced algorithms to optimize your environmental impact
              </p>
              <div className="mt-4 flex items-center text-emerald-200 text-xs">
                <span className="mr-2">🧠</span>
                <span>Machine learning powered</span>
              </div>
            </div>

            <div className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="text-5xl mb-4 group-hover:animate-pulse">🏆</div>
              <h3 className="text-xl font-bold mb-3 text-white">Gamification</h3>
              <p className="text-emerald-100 text-sm leading-relaxed">
                Compete with friends, earn eco-points, and climb the global leaderboard while saving the planet
              </p>
              <div className="mt-4 flex items-center text-emerald-200 text-xs">
                <span className="mr-2">🎯</span>
                <span>Achievement system</span>
              </div>
            </div>

            <div className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="text-5xl mb-4 group-hover:animate-bounce">📊</div>
              <h3 className="text-xl font-bold mb-3 text-white">Analytics</h3>
              <p className="text-emerald-100 text-sm leading-relaxed">
                Visualize your progress with beautiful charts and compare your impact with community averages
              </p>
              <div className="mt-4 flex items-center text-emerald-200 text-xs">
                <span className="mr-2">📈</span>
                <span>Interactive dashboards</span>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-white mb-2">10K+</div>
                <div className="text-emerald-100">Active Users</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-white mb-2">500T</div>
                <div className="text-emerald-100">CO₂ Saved</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-white mb-2">95%</div>
                <div className="text-emerald-100">User Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Call to Action Footer */}
          <div className="mt-16 text-center">
            <p className="text-white text-lg mb-6">
              Ready to make a difference? Join the eco-revolution today! 🌍
            </p>
            <div className="flex justify-center space-x-4">
              <div className="animate-bounce">🌱</div>
              <div className="animate-bounce" style={{ animationDelay: '0.1s' }}>🌿</div>
              <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>🍃</div>
              <div className="animate-bounce" style={{ animationDelay: '0.3s' }}>🌳</div>
              <div className="animate-bounce" style={{ animationDelay: '0.4s' }}>🌍</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ActivityLogView Component
const ActivityLogView = ({ state, dispatch }) => {
  const [activeForm, setActiveForm] = useState('transport');
  const [formData, setFormData] = useState({
    transport: { vehicleType: 'Sedan', distance: '' },
    energy: { electricity: '' },
    food: { mealType: 'High Meat' }
  });

  const calculateEmission = (type, data) => {
    switch (type) {
      case 'transport':
        return EMISSION_FACTORS.transport[data.vehicleType] * parseFloat(data.distance || 0);
      case 'energy':
        return EMISSION_FACTORS.energy * parseFloat(data.electricity || 0);
      case 'food':
        return EMISSION_FACTORS.food[data.mealType];
      default:
        return 0;
    }
  };

  const handleSubmit = async (type) => {
    const data = formData[type];
    
    // Validate form data
    if (type === 'transport' && !data.distance) return;
    if (type === 'energy' && !data.electricity) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const activity = await activitiesAPI.logActivity(type, data);
      dispatch({ type: 'ADD_ACTIVITY', payload: activity });
      
      // Reset form
      setFormData({
        ...formData,
        [type]: type === 'transport' ? { vehicleType: 'Sedan', distance: '' } :
                type === 'energy' ? { electricity: '' } :
                { mealType: 'High Meat' }
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateFormData = (type, field, value) => {
    setFormData({
      ...formData,
      [type]: { ...formData[type], [field]: value }
    });
  };

  const renderTransportForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
        <select
          value={formData.transport.vehicleType}
          onChange={(e) => updateFormData('transport', 'vehicleType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="Sedan">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="Motorbike">Motorbike</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Distance (km)</label>
        <input
          type="number"
          value={formData.transport.distance}
          onChange={(e) => updateFormData('transport', 'distance', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          placeholder="Enter distance"
        />
      </div>
      {formData.transport.distance && (
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Estimated Carbon Emission:</p>
          <p className="text-lg font-semibold text-green-600">
            {calculateEmission('transport', formData.transport).toFixed(2)} kg CO₂
          </p>
        </div>
      )}
      <button
        onClick={() => handleSubmit('transport')}
        disabled={!formData.transport.distance || state.loading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition duration-200 flex items-center justify-center"
      >
        {state.loading ? <LoadingSpinner /> : 'Log Transport Activity'}
      </button>
    </div>
  );

  const renderEnergyForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Electricity Used (kWh)</label>
        <input
          type="number"
          value={formData.energy.electricity}
          onChange={(e) => updateFormData('energy', 'electricity', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          placeholder="Enter electricity usage"
        />
      </div>
      {formData.energy.electricity && (
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Estimated Carbon Emission:</p>
          <p className="text-lg font-semibold text-green-600">
            {calculateEmission('energy', formData.energy).toFixed(2)} kg CO₂
          </p>
        </div>
      )}
      <button
        onClick={() => handleSubmit('energy')}
        disabled={!formData.energy.electricity || state.loading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition duration-200 flex items-center justify-center"
      >
        {state.loading ? <LoadingSpinner /> : 'Log Energy Usage'}
      </button>
    </div>
  );

  const renderFoodForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type</label>
        <select
          value={formData.food.mealType}
          onChange={(e) => updateFormData('food', 'mealType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="High Meat">High Meat</option>
          <option value="Low Meat">Low Meat</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Vegan">Vegan</option>
        </select>
      </div>
      <div className="p-3 bg-green-50 rounded-lg">
        <p className="text-sm text-gray-600">Estimated Carbon Emission:</p>
        <p className="text-lg font-semibold text-green-600">
          {calculateEmission('food', formData.food).toFixed(2)} kg CO₂
        </p>
      </div>
      <button
        onClick={() => handleSubmit('food')}
        disabled={state.loading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition duration-200 flex items-center justify-center"
      >
        {state.loading ? <LoadingSpinner /> : 'Log Food Consumption'}
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Log Your Activities</h1>
      
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex border-b">
          {[
            { id: 'transport', label: 'Transport', icon: Car },
            { id: 'energy', label: 'Energy', icon: Lightbulb },
            { id: 'food', label: 'Food', icon: UtensilsCrossed }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveForm(id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 transition duration-200 ${
                activeForm === id
                  ? 'bg-green-50 text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
        
        <div className="p-6">
          {activeForm === 'transport' && renderTransportForm()}
          {activeForm === 'energy' && renderEnergyForm()}
          {activeForm === 'food' && renderFoodForm()}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Activities</h3>
        {state.activities.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No activities logged yet. Start tracking your carbon footprint!</p>
        ) : (
          <div className="space-y-3">
            {state.activities.slice(-5).reverse().map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    {activity.type === 'transport' && <Car className="w-5 h-5 text-green-600" />}
                    {activity.type === 'energy' && <Lightbulb className="w-5 h-5 text-green-600" />}
                    {activity.type === 'food' && <UtensilsCrossed className="w-5 h-5 text-green-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{activity.category}</p>
                    <p className="text-sm text-gray-600">{activity.carbon_kg} kg CO₂</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+{activity.points} pts</p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// WeatherWidget Component
const WeatherWidget = ({ weatherData, dispatch }) => {
  const getWeatherTip = () => {
    if (weatherData.condition === 'Sunny') {
      return { tip: "Sunny? Cycle instead of driving!", points: 10 };
    } else {
      return { tip: "Rainy? Stay home and save energy!", points: 5 };
    }
  };

  const weatherTip = getWeatherTip();

  return (
    <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Today's Weather</h3>
        <span className="text-2xl">{weatherData.condition === 'Sunny' ? '☀️' : '🌧️'}</span>
      </div>
      <p className="text-lg font-bold mb-2">{weatherData.condition} {weatherData.temp}</p>
      <div className="bg-white bg-opacity-20 rounded p-2">
        <p className="text-sm">{weatherTip.tip}</p>
        <p className="text-xs font-semibold">+{weatherTip.points} Eco-Points</p>
      </div>
    </div>
  );
};

// Recommendations Component
const Recommendations = () => {
  const recommendations = [
    { tip: "Take public transport today", points: 15, icon: "🚌" },
    { tip: "Opt for a vegetarian meal", points: 8, icon: "🥗" },
    { tip: "Use LED bulbs at home", points: 12, icon: "💡" },
    { tip: "Unplug unused electronics", points: 6, icon: "🔌" }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Daily Recommendations</h3>
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{rec.icon}</span>
              <span className="text-gray-700">{rec.tip}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-600">+{rec.points}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ComparatorCard Component
const ComparatorCard = () => {
  const comparisons = [
    { metric: "Carbon Footprint", status: "15% lower than national average", color: "text-green-600", icon: "📉" },
    { metric: "Energy Usage", status: "8% higher than neighborhood", color: "text-orange-600", icon: "⚡" }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Impact Comparison</h3>
      <div className="space-y-4">
        {comparisons.map((comp, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{comp.icon}</span>
              <div>
                <p className="font-medium text-gray-800">{comp.metric}</p>
                <p className={`text-sm ${comp.color}`}>{comp.status}</p>
              </div>
            </div>
            <TrendingUp className={`w-5 h-5 ${comp.color}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

// SocialShareBar Component
const SocialShareBar = ({ userPoints }) => {
  const handleShare = (platform) => {
    const message = `Just earned ${userPoints} Eco-Points on EcoTrack! Join me in reducing carbon footprint! #EcoTrack #ClimateAction`;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://ecotrack.app')}&summary=${encodeURIComponent(message)}`, '_blank');
    } else {
      // Generic share using Web Share API if available
      if (navigator.share) {
        navigator.share({
          title: 'EcoTrack Progress',
          text: message,
          url: 'https://ecotrack.app'
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(message);
        alert('Progress copied to clipboard!');
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h4 className="text-lg font-semibold mb-3 text-gray-800">Share Your Progress</h4>
      <div className="flex space-x-3">
        <button
          onClick={() => handleShare('twitter')}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          <Twitter className="w-4 h-4" />
          <span>Twitter</span>
        </button>
        <button
          onClick={() => handleShare('linkedin')}
          className="flex items-center space-x-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition duration-200"
        >
          <Linkedin className="w-4 h-4" />
          <span>LinkedIn</span>
        </button>
        <button
          onClick={() => handleShare('general')}
          className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

// Leaderboard Component
const Leaderboard = ({ leaderboard, currentUser }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
        <Award className="w-5 h-5 mr-2 text-yellow-500" />
        Leaderboard
      </h3>
      <div className="space-y-3">
        {leaderboard.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No users on leaderboard yet. Be the first!</p>
        ) : (
          leaderboard.slice(0, 5).map((entry) => {
            const isCurrentUser = entry.userId === currentUser.id;
            return (
              <div key={entry.rank} className={`flex items-center justify-between p-3 rounded-lg ${
                isCurrentUser ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    entry.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                    entry.rank === 2 ? 'bg-gray-300 text-gray-700' :
                    entry.rank === 3 ? 'bg-orange-400 text-orange-900' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {entry.rank}
                  </div>
                  <span className={`font-medium ${isCurrentUser ? 'text-green-700' : 'text-gray-800'}`}>
                    {isCurrentUser ? 'You' : entry.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-600">{entry.points}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// GoalSetting Component
const GoalSetting = ({ user, dispatch }) => {
  const [newGoal, setNewGoal] = useState(user.target_kg);

  const handleSetGoal = async () => {
    if (!newGoal || newGoal <= 0) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await authAPI.updateGoal(newGoal);
      dispatch({ type: 'UPDATE_USER_GOAL', payload: newGoal });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const totalCarbon = user.activities?.reduce((sum, activity) => sum + activity.carbon_kg, 0) || 0;
  const progress = Math.min((totalCarbon / user.target_kg) * 100, 100);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
        <Target className="w-5 h-5 mr-2 text-blue-500" />
        Monthly Goal
      </h3>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{totalCarbon.toFixed(1)} / {user.target_kg} kg CO₂</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{progress.toFixed(1)}% of monthly goal</p>
      </div>

      <div className="flex space-x-2">
        <input
          type="number"
          value={newGoal}
          onChange={(e) => setNewGoal(parseInt(e.target.value))}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          placeholder="Set new goal (kg CO₂)"
        />
        <button
          onClick={handleSetGoal}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
        >
          Update
        </button>
      </div>
    </div>
  );
};

// CarbonChart Component
const CarbonChart = ({ activities }) => {
  // Generate last 7 days data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  });

  const chartData = last7Days.map(day => {
    const dayActivities = activities.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      const dayName = activityDate.toLocaleDateString('en-US', { weekday: 'short' });
      return dayName === day;
    });
    return dayActivities.reduce((sum, activity) => sum + activity.carbon_kg, 0);
  });

  const data = {
    labels: last7Days,
    datasets: [
      {
        label: 'Carbon Footprint (kg CO₂)',
        data: chartData,
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Carbon Footprint Trend',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'kg CO₂'
        }
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Bar data={data} options={options} />
    </div>
  );
};

// DashboardView Component
const DashboardView = ({ state, dispatch }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Your Eco Dashboard</h1>
        <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-lg">
          <Zap className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-green-800">{state.user.points} Eco-Points</span>
        </div>
      </div>

      {/* Top Row - Weather and Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <WeatherWidget weatherData={state.weatherData} dispatch={dispatch} />
        <div className="md:col-span-2">
          <Recommendations />
        </div>
      </div>

      {/* Middle Row - Leaderboard, Goal Setting, and Social Share */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Leaderboard leaderboard={state.leaderboard} currentUser={state.user} />
        <GoalSetting user={state.user} dispatch={dispatch} />
        <SocialShareBar userPoints={state.user.points} />
      </div>

      {/* Bottom Row - Chart and Comparator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CarbonChart activities={state.activities} />
        <ComparatorCard />
      </div>
    </div>
  );
};

// ResourceHub Component
const ResourceHub = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Resource Hub</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sustainable Living Library */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-green-600" />
            Sustainable Living Library
          </h3>
          <ul className="space-y-3">
            <li className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h4 className="font-medium text-gray-800">Composting 101</h4>
              <p className="text-sm text-gray-600">Learn the basics of home composting</p>
            </li>
            <li className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-medium text-gray-800">Water Saving Checklist</h4>
              <p className="text-sm text-gray-600">Simple ways to reduce water usage</p>
            </li>
            <li className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-medium text-gray-800">Energy Efficiency Guide</h4>
              <p className="text-sm text-gray-600">Optimize your home's energy consumption</p>
            </li>
            <li className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-medium text-gray-800">Sustainable Transportation</h4>
              <p className="text-sm text-gray-600">Eco-friendly commuting options</p>
            </li>
          </ul>
        </div>

        {/* External Links/Files */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">External Resources</h3>
          <div className="space-y-3">
            <button className="block w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200">
              <h4 className="font-medium text-gray-800">Local Recycling Guide (PDF)</h4>
              <p className="text-sm text-gray-600">Complete guide to recycling in your area</p>
            </button>
            <button className="block w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200">
              <h4 className="font-medium text-gray-800">Global Footprint Network</h4>
              <p className="text-sm text-gray-600">International sustainability resources</p>
            </button>
            <button className="block w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200">
              <h4 className="font-medium text-gray-800">Carbon Calculator Tools</h4>
              <p className="text-sm text-gray-600">Advanced carbon footprint calculators</p>
            </button>
          </div>
        </div>

        {/* Community & Advocacy */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Community & Advocacy</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Join Local Eco-Groups</h4>
              <p className="text-sm text-gray-600 mb-3">
                Connect with like-minded individuals in your community who are passionate about environmental sustainability. 
                Local eco-groups organize cleanup events, tree planting initiatives, and educational workshops that make a real difference.
              </p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition duration-200">
                Find Groups Near You
              </button>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Advocacy Resources</h4>
              <p className="text-sm text-gray-600">
                Learn how to advocate for environmental policies in your local government and support sustainable initiatives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Navigation Component
const Navigation = ({ state, dispatch }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'activities', label: 'Log Activities', icon: Plus },
    { id: 'resources', label: 'Resource Hub', icon: BookOpen }
  ];

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Leaf className="w-8 h-8 text-green-600" />
            <span className="text-xl font-bold text-gray-800">EcoTrack</span>
          </div>
          
          <div className="flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: item.id })}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition duration-200 ${
                    state.currentView === item.id
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            <div className="flex items-center space-x-2 bg-green-100 px-3 py-2 rounded-lg">
              <Award className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">{state.user.points}</span>
            </div>
            
            <button
              onClick={() => dispatch({ type: 'LOGOUT' })}
              className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Main App Component
function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize weather data on mount
  useEffect(() => {
    const weatherData = generateWeatherData();
    dispatch({ type: 'SET_WEATHER', payload: weatherData });
  }, []);

  // Load user data and activities when authenticated
  useEffect(() => {
    const loadUserData = async () => {
      if (state.isAuthenticated) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          
          // Load user profile
          const userProfile = await authAPI.getProfile();
          dispatch({ type: 'SET_USER', payload: userProfile });
          
          // Load user activities
          const activities = await activitiesAPI.getMyActivities();
          dispatch({ type: 'SET_ACTIVITIES', payload: activities });
          
          // Load leaderboard
          const leaderboard = await leaderboardAPI.getLeaderboard();
          dispatch({ type: 'SET_LEADERBOARD', payload: leaderboard });
          
        } catch (error) {
          console.error('Error loading user data:', error);
          dispatch({ type: 'SET_ERROR', payload: error.message });
          // If token is invalid, logout
          if (error.message.includes('Token') || error.message.includes('authorization')) {
            dispatch({ type: 'LOGOUT' });
          }
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };

    loadUserData();
  }, [state.isAuthenticated]);

  // Reload leaderboard when user points change
  useEffect(() => {
    const reloadLeaderboard = async () => {
      if (state.isAuthenticated && state.user.points > 0) {
        try {
          const leaderboard = await leaderboardAPI.getLeaderboard();
          dispatch({ type: 'SET_LEADERBOARD', payload: leaderboard });
        } catch (error) {
          console.error('Error reloading leaderboard:', error);
        }
      }
    };

    reloadLeaderboard();
  }, [state.user.points, state.isAuthenticated]);

  // Render unauthenticated view
  if (!state.isAuthenticated) {
    return <AuthLandingPage state={state} dispatch={dispatch} />;
  }

  // Show loading spinner while loading initial data
  if (state.loading && !state.user.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading your eco data...</p>
        </div>
      </div>
    );
  }

  // Render authenticated view
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation state={state} dispatch={dispatch} />
      
      <div className="container mx-auto px-4 py-8">
        {state.error && (
          <ErrorMessage 
            message={state.error} 
            onDismiss={() => dispatch({ type: 'CLEAR_ERROR' })} 
          />
        )}
        
        {state.currentView === 'dashboard' && (
          <DashboardView state={state} dispatch={dispatch} />
        )}
        {state.currentView === 'activities' && (
          <ActivityLogView state={state} dispatch={dispatch} />
        )}
        {state.currentView === 'resources' && (
          <ResourceHub />
        )}
      </div>
    </div>
  );
}

export default App;