/**
 * SuccessModal Component - Candy Theme
 * Shows success message after purchase or restock
 */

import { FaCheckCircle, FaTimes, FaCookie, FaCandyCane, FaGlassCheers, FaSmile } from 'react-icons/fa';

const formatLabel = (key) =>
    key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

// Random success emojis for variety
const successEmojis = ['🎉', '✨', '🍬', '🍭', '🍪', '🧁', '🎊', '🌟', '✅', '🎯'];
const getRandomEmoji = () => successEmojis[Math.floor(Math.random() * successEmojis.length)];

const SuccessModal = ({ message, details = {}, onClose }) => {
    if (!message) return null;

    const successEmoji = getRandomEmoji();

    return (
        <div className="fixed inset-0 z-[1000] overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>

            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4 text-center">
                <div className="relative transform overflow-hidden rounded-2xl bg-white/95 backdrop-blur-lg text-left shadow-2xl transition-all w-full max-w-md border border-yellow-100 animate-scale-in">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-400 px-6 py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <FaCheckCircle className="text-xl text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        Success!
                                    </h2>
                                    <p className="text-white/90 text-sm">
                                        Operation completed successfully
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                            >
                                <FaTimes className="text-lg" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6">
                        {/* Success Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                {/* Animated background rings */}
                                <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full animate-ping opacity-20"></div>
                                <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full animate-ping opacity-30" style={{animationDelay: '0.5s'}}></div>
                                
                                {/* Main icon container */}
                                <div className="relative w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-4xl">{successEmoji}</span>
                                </div>

                                {/* Small decorative candies */}
                                <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-lg">
                                    🍬
                                </div>
                                <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-lg">
                                    🍭
                                </div>
                            </div>
                        </div>

                        {/* Success Message */}
                        <div className="text-center mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-3">
                                {message}
                            </h3>
                            <p className="text-gray-600">
                                Your action was completed successfully!
                            </p>
                        </div>

                        {/* Details */}
                        {Object.keys(details).length > 0 && (
                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-5 mb-6 border border-yellow-100">
                                <div className="flex items-center space-x-2 mb-4">
                                    <FaCandyCane className="text-yellow-500" />
                                    <h4 className="font-bold text-gray-800">Transaction Details</h4>
                                </div>
                                
                                <div className="space-y-4">
                                    {Object.entries(details).map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-yellow-100 hover:bg-white transition-colors">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-sm">📝</span>
                                                </div>
                                                <span className="font-medium text-gray-700">
                                                    {formatLabel(key)}
                                                </span>
                                            </div>
                                            <span className="font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Celebration Message */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 mb-6">
                            <div className="flex items-center space-x-3">
                                <FaSmile className="text-2xl text-green-500" />
                                <div>
                                    <p className="font-medium text-green-800">Sweet Success!</p>
                                    <p className="text-sm text-green-600">
                                        Your sweet transaction is complete. Enjoy your treats!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-gradient-to-r from-gray-50 to-yellow-50/30 px-6 py-4 border-t border-yellow-100">
                        <div className="flex space-x-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-400 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-orange-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center space-x-2"
                            >
                                <FaGlassCheers />
                                <span>Continue Shopping</span>
                            </button>
                        </div>
                        
                        {/* Additional Info */}
                        <p className="text-center text-xs text-gray-500 mt-4">
                            You can view this transaction in your order history
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;