import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/leaderboard');
        setLeaderboard(res.data);
      } catch (err) {
        setError('Error fetching leaderboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">EcoTrack Leaderboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Top Eco-Warriors</h2>
        
        {loading ? (
          <p className="text-gray-600">Loading leaderboard...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : leaderboard.length === 0 ? (
          <p className="text-gray-600">No data available yet. Start logging activities to appear on the leaderboard!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b text-left">Rank</th>
                  <th className="py-3 px-4 border-b text-left">User</th>
                  <th className="py-3 px-4 border-b text-right">Eco-Points</th>
                  <th className="py-3 px-4 border-b text-right">Carbon Footprint (kg)</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user, index) => (
                  <tr key={user._id} className={index < 3 ? 'bg-green-50' : ''}>
                    <td className="py-3 px-4 border-b">
                      {index === 0 ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-yellow-400 text-white rounded-full font-bold">1</span>
                      ) : index === 1 ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-300 text-white rounded-full font-bold">2</span>
                      ) : index === 2 ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-yellow-700 text-white rounded-full font-bold">3</span>
                      ) : (
                        <span className="px-3">{index + 1}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 border-b">
                      {user.email.split('@')[0]}
                    </td>
                    <td className="py-3 px-4 border-b text-right font-medium">
                      {user.totalPoints}
                    </td>
                    <td className="py-3 px-4 border-b text-right">
                      {user.totalCarbon.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">How to Earn Eco-Points</h3>
          <p className="text-gray-700 mb-2">
            Eco-Points are awarded inversely to your carbon footprint. The lower your carbon emissions, the more points you earn!
          </p>
          <p className="text-gray-700">
            Log your daily activities to track your carbon footprint and compete with others to become the top Eco-Warrior.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;