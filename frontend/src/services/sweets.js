/**
 * Sweets API Service
 * Handles all API calls related to sweets
 */

import api from './api';

/**
 * Get all sweets
 * @returns {Promise} List of all sweets
 */
export const getAllSweets = async () => {
  try {
    console.log('🔵 Fetching all sweets...');
    const response = await api.get('/sweets/');
    console.log('✅ Sweets fetched:', response.data.length, 'items');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching sweets:', error);
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Get a single sweet by ID
 * @param {number} id - Sweet ID
 * @returns {Promise} Sweet details
 */
export const getSweetById = async (id) => {
  try {
    console.log('🔵 Fetching sweet with ID:', id);
    const response = await api.get(`/sweets/${id}/`);
    console.log('✅ Sweet fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching sweet:', error);
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Create a new sweet (Admin only)
 * @param {Object} sweetData - Sweet data to create
 * @returns {Promise} Created sweet
 */
export const createSweet = async (sweetData) => {
  try {
    console.log('🔵 Creating new sweet:', sweetData);
    const response = await api.post('/sweets/', sweetData);
    console.log('✅ Sweet created:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating sweet:', error);
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Update a sweet (Admin only)
 * @param {number} id - Sweet ID
 * @param {Object} sweetData - Updated sweet data
 * @returns {Promise} Updated sweet
 */
export const updateSweet = async (id, sweetData) => {
  try {
    console.log('🔵 Updating sweet:', id, sweetData);
    const response = await api.put(`/sweets/${id}/`, sweetData);
    console.log('✅ Sweet updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error updating sweet:', error);
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Delete a sweet (Admin only)
 * @param {number} id - Sweet ID
 * @returns {Promise}
 */
export const deleteSweet = async (id) => {
  try {
    console.log('🔵 Deleting sweet:', id);
    await api.delete(`/sweets/${id}/`);
    console.log('✅ Sweet deleted');
    return true;
  } catch (error) {
    console.error('❌ Error deleting sweet:', error);
    throw error.response?.data || { message: error.message };
  }
};

/**
 * Search sweets with filters
 * @param {Object} filters - Search filters (name, category, min_price, max_price)
 * @returns {Promise} List of matching sweets
 */
export const searchSweets = async (filters) => {
  try {
    console.log('🔵 Searching sweets with filters:', filters);
    
    // Build query string
    const params = new URLSearchParams();
    if (filters.name) params.append('name', filters.name);
    if (filters.category) params.append('category', filters.category);
    if (filters.min_price) params.append('min_price', filters.min_price);
    if (filters.max_price) params.append('max_price', filters.max_price);
    
    const response = await api.get(`/sweets/search/?${params.toString()}`);
    console.log('✅ Search results:', response.data.length, 'items');
    return response.data;
  } catch (error) {
    console.error('❌ Error searching sweets:', error);
    throw error.response?.data || { message: error.message };
  }
};