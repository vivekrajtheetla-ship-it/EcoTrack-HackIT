import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthLandingPage = () => {
  const [authMode, setAuthMode] = useState(null); // null, 'login', 'register'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        const result = await register(formData.email, formData.password);
        if (result.error) {
          setError(result.error);
        }
      } else if (authMode === 'login') {
        const result = await login(formData.email, formData.password);
        if (result.error) {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', confirmPassword: '' });
    setError('');
    setAuthMode(null);
  };

  if (authMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {authMode === 'login' ? 'Welcome Back' : 'Join EcoTrack'}
            </h2>
            <p className="text-gray-600">
              {authMode === 'login' 
                ? 'Sign in to continue your eco journey' 
                : 'Start tracking your carbon footprint today'
              }
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                placeholder="Enter your password"
                required
              />
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading 
                ? (authMode === 'login' ? 'Signing In...' : 'Creating Account...') 
                : (authMode === 'login' ? 'Sign In' : 'Create Account')
              }
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={resetForm}
              className="text-green-600 hover:text-green-700 font-medium transition duration-200"
            >
              ← Back to main page
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-green-600 hover:text-green-700 font-medium transition duration-200"
              >
                {authMode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        {/* Logo and Title */}
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            EcoTrack
          </h1>
          <p className="text-xl md:text-2xl text-green-100 font-light">
            Track. Reduce. Impact.
          </p>
        </div>

        {/* Compelling Quote */}
        <div className="mb-12 bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20">
          <blockquote className="text-2xl md:text-3xl text-white font-medium mb-4">
            "The best time to plant a tree was 20 years ago. The second best time is now."
          </blockquote>
          <p className="text-green-100 text-lg">
            Join thousands of users reducing their carbon footprint by <span className="font-semibold">23% on average</span>
          </p>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => setAuthMode('login')}
            className="bg-white text-green-600 font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 min-w-[200px]"
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className="bg-green-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 min-w-[200px] border-2 border-green-700 hover:border-green-600"
          >
            Get Started Free
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <div className="text-3xl font-bold mb-2">🌱</div>
            <h3 className="font-semibold mb-2">Track Daily Activities</h3>
            <p className="text-green-100 text-sm">Monitor transportation, energy usage, and meals</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <div className="text-3xl font-bold mb-2">🤖</div>
            <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
            <p className="text-green-100 text-sm">Get personalized recommendations to reduce your impact</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <div className="text-3xl font-bold mb-2">🏆</div>
            <h3 className="font-semibold mb-2">Compete & Achieve</h3>
            <p className="text-green-100 text-sm">Join the leaderboard and earn eco-points</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLandingPage;