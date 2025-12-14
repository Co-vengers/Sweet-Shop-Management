/**
 * PurchaseModal Component
 * Modal for purchasing sweets - Candy Theme
 */

import { useState, useEffect, useMemo } from 'react';
import { FaTimes, FaMinus, FaPlus, FaShoppingCart, FaExclamationTriangle } from 'react-icons/fa';

const PurchaseModal = ({ sweet, onConfirm, onCancel }) => {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    /* Reset state when modal opens for a new sweet */
    useEffect(() => {
        setQuantity(1);
        setError('');
        setLoading(false);
    }, [sweet]);

    /**
     * Calculate total cost safely
     */
    const totalCost = useMemo(() => {
        if (!sweet) return '0.00';
        return (Number(sweet.price) * quantity).toFixed(2);
    }, [sweet, quantity]);

    /**
     * Handle quantity input change
     */
    const handleQuantityChange = (e) => {
        const value = Number(e.target.value);

        if (Number.isNaN(value)) {
            setQuantity(1);
            return;
        }

        if (value < 1) {
            setQuantity(1);
            setError('');
            return;
        }

        if (value > sweet.quantity) {
            setQuantity(sweet.quantity);
            setError(`Only ${sweet.quantity} units available`);
            return;
        }

        setQuantity(value);
        setError('');
    };

    /**
     * Handle purchase
     */
    const handlePurchase = async () => {
        if (quantity < 1 || quantity > sweet.quantity) {
            setError('Invalid quantity selected');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onConfirm(quantity);
        } catch (err) {
            setError(err?.message || 'Purchase failed. Please try again.');
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
                    <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <FaShoppingCart className="text-xl text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        Purchase Sweet
                                    </h2>
                                    <p className="text-white/90 text-sm">
                                        Complete your sweet purchase
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
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6 border border-purple-100">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-400 rounded-lg flex items-center justify-center text-2xl">
                                        🍬
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-800">{sweet.name}</h3>
                                    <div className="flex items-center space-x-3 mt-2">
                                        <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium">
                                            {sweet.category}
                                        </span>
                                        <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-medium">
                                            {sweet.quantity} units available
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Select Quantity
                            </label>
                            <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                                <button
                                    type="button"
                                    className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg flex items-center justify-center hover:from-purple-700 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    disabled={quantity <= 1 || loading}
                                >
                                    <FaMinus />
                                </button>

                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-800 mb-1">{quantity}</div>
                                    <div className="text-sm text-gray-500">units</div>
                                </div>

                                <button
                                    type="button"
                                    className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg flex items-center justify-center hover:from-purple-700 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => setQuantity(q => Math.min(sweet.quantity, q + 1))}
                                    disabled={quantity >= sweet.quantity || loading}
                                >
                                    <FaPlus />
                                </button>
                            </div>

                            {/* Quantity input for precise control */}
                            <div className="mt-4">
                                <input
                                    type="range"
                                    min="1"
                                    max={sweet.quantity}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    disabled={loading}
                                    className="w-full h-2 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-600 [&::-webkit-slider-thumb]:to-pink-500"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>1</span>
                                    <span className="text-purple-600 font-medium">Quantity: {quantity}</span>
                                    <span>{sweet.quantity}</span>
                                </div>
                            </div>
                        </div>

                        {/* Price Summary */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 mb-6 border border-purple-100">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Unit Price</span>
                                    <span className="text-lg font-bold text-gray-800">
                                        ₹{Number(sweet.price).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Quantity</span>
                                    <span className="text-gray-800">{quantity} × ₹{Number(sweet.price).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-purple-200 pt-3 mt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-800">Total Amount</span>
                                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                                            ₹{totalCost}
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
                    <div className="bg-gradient-to-r from-gray-50 to-purple-50/30 px-6 py-4 border-t border-purple-100">
                        <div className="flex space-x-3">
                            <button
                                onClick={onCancel}
                                disabled={loading}
                                className="flex-1 px-4 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePurchase}
                                disabled={loading || quantity < 1 || quantity > sweet.quantity}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Processing...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center space-x-2">
                                        <FaShoppingCart />
                                        <span>Purchase for ₹{totalCost}</span>
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

export default PurchaseModal;