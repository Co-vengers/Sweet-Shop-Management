/**
 * Inventory API Service
 * Handles purchase and restock operations
 */

import api from './api';

/**
 * Purchase a sweet
 * @param {number} sweetId - Sweet ID
 * @param {number} quantity - Quantity to purchase (default: 1)
 * @returns {Promise} Purchase result
 */
export const purchaseSweet = async (sweetId, quantity = 1) => {
  try {
    console.log('🔵 Purchasing sweet:', sweetId, 'quantity:', quantity);
    const response = await api.post(`/sweets/${sweetId}/purchase/`, { quantity });
    console.log('✅ Purchase successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Purchase error:', error);
    throw error.response?.data || { error: error.message };
  }
};

/**
 * Restock a sweet (Admin only)
 * @param {number} sweetId - Sweet ID
 * @param {number} quantity - Quantity to add (default: 10)
 * @returns {Promise} Restock result
 */
export const restockSweet = async (sweetId, quantity = 10) => {
  try {
    console.log('🔵 Restocking sweet:', sweetId, 'quantity:', quantity);
    const response = await api.post(`/sweets/${sweetId}/restock/`, { quantity });
    console.log('✅ Restock successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Restock error:', error);
    throw error.response?.data || { error: error.message };
  }
};