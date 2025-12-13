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

  const login = async (email, password) => {
    try {
      setError(null);
      await loginService({ email, password });

      const userData = await getUserProfile();
      setUser(userData);

      return { success: true };
    } catch (err) {
      const errorMessage =
        err.detail || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await registerService(userData);
      setUser(response.user);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.email?.[0] ||
        err.username?.[0] ||
        err.password?.[0] ||
        'Registration failed.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

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
