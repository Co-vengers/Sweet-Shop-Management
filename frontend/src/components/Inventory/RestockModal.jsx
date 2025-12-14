/**
 * RestockModal Component
 * Modal for restocking sweets - Candy Theme
 */

import { useState, useEffect, useMemo } from 'react';
import { FaTimes, FaMinus, FaPlus, FaBoxOpen, FaExclamationTriangle } from 'react-icons/fa';

const RestockModal = ({ sweet, onConfirm, onCancel }) => {
    const [quantity, setQuantity] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    /* Reset state when modal opens for a new sweet */
    useEffect(() => {
        setQuantity(10);
        setError('');
        setLoading(false);
    }, [sweet]);

    /**
     * Calculate new stock safely
     */
    const newStock = useMemo(() => {
        if (!sweet) return 0;
        return Number(sweet.quantity) + quantity;
    }, [sweet, quantity]);

    /**
     * Handle quantity input change
     */
    const handleQuantityChange = (e) => {
        const value = Number(e.target.value);

        if (Number.isNaN(value)) {
            setQuantity(10);
            return;
        }

        if (value < 1) {
            setQuantity(1);
            setError('');
            return;
        }

        if (value > 1000) {
            setQuantity(1000);
            setError('Maximum restock limit is 1000 units');
            return;
        }

        setQuantity(value);
        setError('');
    };

    /**
     * Handle restock
     */
    const handleRestock = async () => {
        if (quantity < 1) {
            setError('Please select a valid quantity');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onConfirm(quantity);
        } catch (err) {
            setError(err?.message || 'Restock failed. Please try again.');
            setLoading(false);
        }
    };

    if (!sweet) return null;

    return (
        <div className="fixed inset-0 z-[1000] overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>

            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4 text-center">
                <div className="relative transform overflow-hidden rounded-2xl bg-white/95 backdrop-blur-lg text-left shadow-2xl transition-all w-full max-w-md border border-purple-100">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <FaBoxOpen className="text-xl text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        Restock Sweet
                                    </h2>
                                    <p className="text-white/90 text-sm">
                                        Add more inventory
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onCancel}
                                disabled={loading}
                                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors disabled:opacity-50"
                            >
                                <FaTimes className="text-lg" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6">
                        {/* Sweet Info */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6 border border-green-100">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-lg flex items-center justify-center text-2xl">
                                        📦
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-800">{sweet.name}</h3>
                                    <div className="flex items-center space-x-3 mt-2">
                                        <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium">
                                            {sweet.category}
                                        </span>
                                        <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm font-medium">
                                            Current: {sweet.quantity} units
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Add Quantity
                            </label>
                            <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                                <button
                                    type="button"
                                    className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg flex items-center justify-center hover:from-green-700 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => setQuantity(q => Math.max(1, q - 10))}
                                    disabled={quantity <= 10 || loading}
                                >
                                    <FaMinus />
                                </button>

                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-800 mb-1">{quantity}</div>
                                    <div className="text-sm text-gray-500">units to add</div>
                                </div>

                                <button
                                    type="button"
                                    className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg flex items-center justify-center hover:from-green-700 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => setQuantity(q => Math.min(1000, q + 10))}
                                    disabled={quantity >= 1000 || loading}
                                >
                                    <FaPlus />
                                </button>
                            </div>

                            {/* Quantity input for precise control */}
                            <div className="mt-4">
                                <input
                                    type="range"
                                    min="1"
                                    max="1000"
                                    step="10"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    disabled={loading}
                                    className="w-full h-2 bg-gradient-to-r from-green-200 to-emerald-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-green-600 [&::-webkit-slider-thumb]:to-emerald-500"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>1</span>
                                    <span className="text-green-600 font-medium">Add: {quantity} units</span>
                                    <span>1000</span>
                                </div>
                            </div>
                        </div>

                        {/* Stock Summary */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 mb-6 border border-green-100">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Current Stock</span>
                                    <span className="text-lg font-bold text-gray-800">
                                        {sweet.quantity} units
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Adding</span>
                                    <span className="text-gray-800">+{quantity} units</span>
                                </div>
                                <div className="border-t border-green-200 pt-3 mt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-800">New Stock</span>
                                        <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                                            {newStock} units
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl flex items-center space-x-3 animate-shake">
                                <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
                                <span className="text-red-600 text-sm font-medium">{error}</span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="bg-gradient-to-r from-gray-50 to-green-50/30 px-6 py-4 border-t border-green-100">
                        <div className="flex space-x-3">
                            <button
                                onClick={onCancel}
                                disabled={loading}
                                className="flex-1 px-4 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRestock}
                                disabled={loading || quantity < 1}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Processing...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center space-x-2">
                                        <FaBoxOpen />
                                        <span>Restock {quantity} Units</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestockModal;