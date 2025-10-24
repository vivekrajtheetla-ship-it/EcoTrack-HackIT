import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ActivityForm from '../components/ActivityForm';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState(null);
  const [categoryTotals, setCategoryTotals] = useState({
    transportation: 0,
    energy: 0,
    meal: 0
  });
  const [highestCategory, setHighestCategory] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  // Fetch user activities
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/activities/me');
      setActivities(res.data);
      processActivities(res.data);
    } catch (err) {
      setError('Error fetching activities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Process activities for visualization
  const processActivities = (activityData) => {
    // Group by date and calculate daily totals
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      last7Days.push({
        date,
        dateString: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        carbon: 0
      });
    }
    
    // Calculate daily carbon totals
    activityData.forEach(activity => {
      const activityDate = new Date(activity.timestamp);
      activityDate.setHours(0, 0, 0, 0);
      
      const dayIndex = last7Days.findIndex(day => day.date.getTime() === activityDate.getTime());
      if (dayIndex !== -1) {
        last7Days[dayIndex].carbon += activity.carbon_kg;
      }
    });
    
    // Prepare chart data
    setChartData({
      labels: last7Days.map(day => day.dateString),
      datasets: [
        {
          label: 'Carbon Footprint (kg CO2)',
          data: last7Days.map(day => day.carbon),
          backgroundColor: 'rgba(56, 161, 105, 0.8)',
          borderColor: 'rgba(56, 161, 105, 1)',
          borderWidth: 1
        }
      ]
    });
    
    // Calculate category totals
    const totals = {
      transportation: 0,
      energy: 0,
      meal: 0
    };
    
    activityData.forEach(activity => {
      totals[activity.type] += activity.carbon_kg;
    });
    
    setCategoryTotals(totals);
    
    // Determine highest impact category
    let highest = 'transportation';
    if (totals.energy > totals[highest]) highest = 'energy';
    if (totals.meal > totals[highest]) highest = 'meal';
    
    setHighestCategory(highest);
    setRecommendations(getRecommendations(highest));
  };

  // Get recommendations based on highest impact category
  const getRecommendations = (category) => {
    const recommendations = {
      transportation: [
        'Consider carpooling or using public transportation',
        'Combine multiple errands into a single trip',
        'Try walking or biking for short distances',
        'Consider an electric or hybrid vehicle for your next purchase'
      ],
      energy: [
        'Switch to LED light bulbs',
        'Unplug electronics when not in use',
        'Use a programmable thermostat to reduce heating/cooling when away',
        'Consider renewable energy options like solar panels'
      ],
      meal: [
        'Try incorporating more plant-based meals into your diet',
        'Choose locally sourced and seasonal foods when possible',
        'Reduce food waste by planning meals and using leftovers',
        'Choose sustainably sourced seafood and reduce red meat consumption'
      ]
    };
    
    return recommendations[category] || recommendations.transportation;
  };

  // Handle new activity added
  const handleActivityAdded = (newActivity) => {
    fetchActivities();
  };

  // Initial data fetch
  useEffect(() => {
    fetchActivities();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Get emission category indicator
  const getEmissionCategory = (total) => {
    if (total < 10) return { label: 'Low', color: 'text-green-600' };
    if (total < 30) return { label: 'Medium', color: 'text-yellow-600' };
    return { label: 'High', color: 'text-red-600' };
  };

  const totalEmissions = categoryTotals.transportation + categoryTotals.energy + categoryTotals.meal;
  const emissionCategory = getEmissionCategory(totalEmissions);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Carbon Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ActivityForm onActivityAdded={handleActivityAdded} />
        
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">7-Day Carbon Trend</h2>
            
            {loading ? (
              <p className="text-gray-600">Loading chart data...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : chartData ? (
              <Bar 
                data={chartData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: false
                    }
                  }
                }} 
              />
            ) : (
              <p className="text-gray-600">No data available</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Carbon Footprint Summary</h2>
          
          <div className="mb-4">
            <p className="text-gray-700 mb-1">Total Emissions (7 days):</p>
            <p className="text-2xl font-bold">
              {totalEmissions.toFixed(2)} kg CO2e
              <span className={`ml-2 text-sm ${emissionCategory.color}`}>
                ({emissionCategory.label})
              </span>
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Transportation:</span>
              <span className="font-medium">{categoryTotals.transportation.toFixed(2)} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Energy:</span>
              <span className="font-medium">{categoryTotals.energy.toFixed(2)} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Food:</span>
              <span className="font-medium">{categoryTotals.meal.toFixed(2)} kg</span>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Personalized Recommendations</h2>
          
          {highestCategory && (
            <div>
              <p className="text-gray-700 mb-3">
                Based on your activities, your highest carbon impact is from <span className="font-semibold capitalize">{highestCategory}</span>. 
                Here are some tips to reduce your footprint:
              </p>
              
              <ul className="list-disc pl-5 space-y-2">
                {recommendations.map((tip, index) => (
                  <li key={index} className="text-gray-700">{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activities</h2>
        
        {loading ? (
          <p className="text-gray-600">Loading activities...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : activities.length === 0 ? (
          <p className="text-gray-600">No activities logged yet. Use the form above to log your first activity!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Date</th>
                  <th className="py-2 px-4 border-b text-left">Type</th>
                  <th className="py-2 px-4 border-b text-left">Details</th>
                  <th className="py-2 px-4 border-b text-right">Carbon (kg)</th>
                  <th className="py-2 px-4 border-b text-right">Eco-Points</th>
                </tr>
              </thead>
              <tbody>
                {activities.map(activity => (
                  <tr key={activity._id}>
                    <td className="py-2 px-4 border-b">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b capitalize">{activity.type}</td>
                    <td className="py-2 px-4 border-b">
                      {activity.type === 'meal' 
                        ? activity.mealText 
                        : `${activity.value} ${activity.type === 'transportation' ? 'miles' : 'kWh'}`
                      }
                    </td>
                    <td className="py-2 px-4 border-b text-right">{activity.carbon_kg.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b text-right">{activity.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;