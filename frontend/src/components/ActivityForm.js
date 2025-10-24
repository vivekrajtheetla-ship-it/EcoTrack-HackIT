import React, { useState } from 'react';
import axios from 'axios';

const ActivityForm = ({ onActivityAdded }) => {
  const [formData, setFormData] = useState({
    type: 'transportation',
    value: '',
    mealText: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { type, value, mealText } = formData;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate form data
      if (type !== 'meal' && (!value || isNaN(value) || value <= 0)) {
        setError('Please enter a valid positive number');
        setLoading(false);
        return;
      }

      if (type === 'meal' && !mealText) {
        setError('Please describe your meal');
        setLoading(false);
        return;
      }

      // Submit activity
      const res = await axios.post('http://localhost:5000/api/activities', formData);
      
      // Reset form
      setFormData({
        ...formData,
        value: '',
        mealText: ''
      });
      
      setSuccess('Activity logged successfully!');
      
      // Notify parent component
      if (onActivityAdded) {
        onActivityAdded(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error logging activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Log New Activity</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
            Activity Type
          </label>
          <select
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="type"
            name="type"
            value={type}
            onChange={handleChange}
          >
            <option value="transportation">Transportation</option>
            <option value="energy">Energy</option>
            <option value="meal">Meal</option>
          </select>
        </div>
        
        {type !== 'meal' ? (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="value">
              {type === 'transportation' ? 'Miles Traveled' : 'Energy Used (kWh)'}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="value"
              type="number"
              name="value"
              value={value}
              onChange={handleChange}
              placeholder={type === 'transportation' ? 'Miles' : 'kWh'}
              step="0.01"
              min="0"
            />
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mealText">
              Describe Your Meal
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="mealText"
              name="mealText"
              value={mealText}
              onChange={handleChange}
              placeholder="Describe what you ate (e.g., 'Grilled chicken salad with olive oil dressing')"
              rows="3"
            />
            <p className="text-sm text-gray-600 mt-1">
              Our AI will analyze your meal and estimate its carbon footprint
            </p>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <button
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging...' : 'Log Activity'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActivityForm;