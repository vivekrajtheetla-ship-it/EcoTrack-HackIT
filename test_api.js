// Quick API Test Script
// Run with: node test_api.js

const API_BASE = 'http://localhost:5002/api';

async function testAPI() {
  console.log('🧪 Testing EcoTrack API...\n');

  try {
    // Test 1: Register a new user
    console.log('1. Testing user registration...');
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Registration successful');
      
      const token = registerData.token;
      
      // Test 2: Get user profile
      console.log('2. Testing user profile...');
      const profileResponse = await fetch(`${API_BASE}/auth/me`, {
        headers: { 'x-auth-token': token }
      });
      
      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        console.log('✅ Profile loaded:', profile.email);
        
        // Test 3: Log an activity
        console.log('3. Testing activity logging...');
        const activityResponse = await fetch(`${API_BASE}/activities`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify({
            type: 'transport',
            data: { vehicleType: 'Sedan', distance: 10 }
          })
        });
        
        if (activityResponse.ok) {
          const activity = await activityResponse.json();
          console.log('✅ Activity logged:', activity.carbon_kg, 'kg CO2');
          
          // Test 4: Get leaderboard
          console.log('4. Testing leaderboard...');
          const leaderboardResponse = await fetch(`${API_BASE}/leaderboard`);
          
          if (leaderboardResponse.ok) {
            const leaderboard = await leaderboardResponse.json();
            console.log('✅ Leaderboard loaded:', leaderboard.length, 'users');
            
            console.log('\n🎉 All tests passed! API is working correctly.');
          } else {
            console.log('❌ Leaderboard test failed');
          }
        } else {
          console.log('❌ Activity logging test failed');
        }
      } else {
        console.log('❌ Profile test failed');
      }
    } else {
      const error = await registerResponse.json();
      if (error.message && error.message.includes('already exists')) {
        console.log('ℹ️ User already exists, trying login...');
        
        // Try login instead
        const loginResponse = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123'
          })
        });
        
        if (loginResponse.ok) {
          console.log('✅ Login successful');
        } else {
          console.log('❌ Login failed');
        }
      } else {
        console.log('❌ Registration failed:', error.message);
      }
    }
    
  } catch (error) {
    console.log('❌ API test failed:', error.message);
    console.log('Make sure the backend server is running on port 5001');
  }
}

testAPI();