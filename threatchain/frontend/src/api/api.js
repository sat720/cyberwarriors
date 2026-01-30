import axios from 'axios';

/**
 * API CLIENT
 * Handles all communication with backend
 */

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ============================================
// TEST ATTACK SIMULATIONS
// ============================================

export const simulateBruteForce = async () => {
  const response = await api.post('/api/test/bruteforce');
  return response.data;
};

export const simulateOTPFlood = async () => {
  const response = await api.post('/api/test/otp-flood');
  return response.data;
};

export const simulateResetAbuse = async () => {
  const response = await api.post('/api/test/reset-abuse');
  return response.data;
};

export const simulateRequestFlood = async () => {
  const response = await api.post('/api/test/request-flood');
  return response.data;
};

// ============================================
// DATA FETCHING
// ============================================

export const getEvents = async (limit = 50) => {
  const response = await api.get(`/api/events?limit=${limit}`);
  return response.data;
};

export const getAlerts = async (limit = 50) => {
  const response = await api.get(`/api/alerts?limit=${limit}`);
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/api/stats');
  return response.data;
};

export const clearAllData = async () => {
  const response = await api.delete('/api/clear-all');
  return response.data;
};

// ============================================
// HEALTH CHECK
// ============================================

export const checkHealth = async () => {
  try {
    const response = await api.get('/');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


// ============================================
// USER AUTHENTICATION
// ============================================

export const registerUser = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

export const requestOTP = async (username) => {
  const response = await api.post('/api/auth/request-otp', { username });
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await api.post('/api/auth/reset-password', data);
  return response.data;
};

export const getUserInfo = async (username) => {
  const response = await api.get(`/api/auth/user/${username}`);
  return response.data;
};

export default api;
