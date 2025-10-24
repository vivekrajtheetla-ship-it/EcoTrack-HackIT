const API_BASE_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api`;

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make authenticated requests
const makeRequest = async (url, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'x-auth-token': token }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  
  return response.json();
};

// Auth API
export const authAPI = {
  register: async (email, password) => {
    const response = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  },

  login: async (email, password) => {
    const response = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  },

  getProfile: async () => {
    return makeRequest('/auth/me');
  },

  updateGoal: async (target_kg) => {
    return makeRequest('/auth/goal', {
      method: 'PUT',
      body: JSON.stringify({ target_kg }),
    });
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

// Activities API
export const activitiesAPI = {
  logActivity: async (type, data) => {
    return makeRequest('/activities', {
      method: 'POST',
      body: JSON.stringify({ type, data }),
    });
  },

  getMyActivities: async () => {
    return makeRequest('/activities/me');
  },
};

// Leaderboard API
export const leaderboardAPI = {
  getLeaderboard: async () => {
    return makeRequest('/leaderboard');
  },
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    // Check if token is expired (basic check)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};