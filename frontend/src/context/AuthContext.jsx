/**
 * Authentication Context
 * Provides authentication state and methods throughout the app
 */

import { createContext, useState, useEffect } from 'react';
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  getUserProfile,
  isAuthenticated,
} from '../services/auth';

// Create the context
export const AuthContext = createContext();

/**
 * AuthProvider Component
 * Wraps the app and provides auth state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const loadUser = async () => {
      if (isAuthenticated()) {
        try {
          const userData = await getUserProfile();
          setUser(userData);
        } catch (err) {
          console.error('Failed to load user:', err);
          logoutService();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  /**
   * Login function
   */
  const login = async (email, password) => {
    try {
      setError(null);
      console.log('🔵 AuthContext: Starting login...');

      // Step 1: Login and get tokens
      // Assumes loginService handles setting tokens in localStorage
      const response = await loginService({ email, password });
      console.log('✅ AuthContext: Login service completed');

      // Step 2: Wait a tiny bit to ensure localStorage is updated (Optional, but safer for async storage)
      await new Promise(resolve => setTimeout(resolve, 100));

      // Step 3: Verify tokens exist
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      console.log('🔍 AuthContext: Token verification', {
        access: accessToken ? 'exists' : 'MISSING',
        refresh: refreshToken ? 'exists' : 'MISSING'
      });

      if (!accessToken) {
        throw new Error('Access token not found after login');
      }

      // Step 4: Get user profile
      console.log('🔵 AuthContext: Fetching user profile...');
      const userData = await getUserProfile();
      console.log('✅ AuthContext: User profile fetched');
      setUser(userData);

      return { success: true };
    } catch (err) {
      console.error('❌ AuthContext: Login error:', err);
      // Use the generic error message or the specific error from the thrown Error
      const errorMessage = err.detail || err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Register function
   */
  const register = async (userData) => {
    try {
      setError(null);
      const response = await registerService(userData);
      
      // Assumes register service also returns user data and logs them in
      setUser(response.user); 
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      // Improved error handling for common backend validation messages
      const errorMessage =
        err.email?.[0] ||
        err.username?.[0] ||
        err.password?.[0] ||
        err.message ||
        'Registration failed.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Logout function
   */
  const logout = () => {
    logoutService();
    setUser(null);
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};