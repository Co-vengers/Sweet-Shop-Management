/**
 * Authentication Service
 * Handles login, registration, and logout
 */

import api from './api';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} API response with user and tokens
 */
export const register = async (userData) => {
  try {
    console.log('🔵 Attempting registration...');
    const response = await api.post('/auth/register/', userData);
    console.log('✅ Registration successful:', response.data);
    
    // Save tokens to localStorage IMMEDIATELY
    if (response.data.access && response.data.refresh) {
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      console.log('✅ Tokens saved to localStorage');
      console.log('   Access token:', response.data.access.substring(0, 20) + '...');
      console.log('   Refresh token:', response.data.refresh.substring(0, 20) + '...');
    } else {
      console.warn('⚠️ No tokens in registration response');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Registration error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Login user
 * @param {Object} credentials - Email and password
 * @returns {Promise} API response with tokens
 */
export const login = async (credentials) => {
  try {
    console.log('🔵 Attempting login with email:', credentials.email);
    
    // Make login request WITHOUT using the api instance
    // because it might have stale tokens in the interceptor
    const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    const data = await response.json();
    console.log('✅ Login successful:', data);
    
    // Save tokens to localStorage IMMEDIATELY and SYNCHRONOUSLY
    if (data.access && data.refresh) {
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      console.log('✅ Tokens saved to localStorage');
      console.log('   Access token:', data.access.substring(0, 20) + '...');
      console.log('   Refresh token:', data.refresh.substring(0, 20) + '...');
      
      // Verify tokens were saved
      const savedAccess = localStorage.getItem('accessToken');
      const savedRefresh = localStorage.getItem('refreshToken');
      console.log('✅ Verification - Tokens in localStorage:', {
        access: savedAccess ? 'exists' : 'missing',
        refresh: savedRefresh ? 'exists' : 'missing'
      });
    } else {
      console.warn('⚠️ No tokens in login response');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Login error:', error);
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = () => {
  console.log('🔵 Logging out...');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  console.log('✅ Tokens removed from localStorage');
};

/**
 * Get current user profile
 * @returns {Promise} User profile data
 */
export const getUserProfile = async () => {
  try {
    console.log('🔵 Fetching user profile...');
    const token = localStorage.getItem('accessToken');
    console.log('🔑 Access token:', token ? `exists (${token.substring(0, 20)}...)` : 'MISSING');
    
    if (!token) {
      throw new Error('No access token found in localStorage');
    }
    
    const response = await api.get('/auth/profile/');
    console.log('✅ Profile fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Profile fetch error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has access token
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  return !!token;
};