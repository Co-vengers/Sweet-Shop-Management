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
        const response = await api.post('/auth/register/', userData);

        //save tokens to localstorage
        if(response.data.access){
            localStorage.setItem('accessToken', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
        }

        return response.data;
    }

    catch(error){
        throw error.response?.data || error.message;
    }
};

/**
 * Login user
 * @param {Object} credentials - Email and password
 * @returns {Promise} API response with tokens
 */
export const login = async (credentials) => {
    try {
        const response = await api.post('/auth/login/', credentials);

        //save tokens to localstorage
        if(response.data.access){
            localStorage.setItem('acessToken', response.data.access);
            localStorage.setItem('refershToken', response.data.refresh);
        }
        return response.data;
    }
    catch(error){
        throw error.response?.data || error.message;
    }
};

/**
 * Logout user
 */
export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

/**
 * Get current user profile
 * @returns {Promise} User profile data
 */
export const getUserProfile = async () => {
    try {
        const response = await api.get('/auth/profile/');
        return response.data;
    }
    catch (error){
        throw error.response?.data || error.message;
    }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has access token
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem('accessToken');
};