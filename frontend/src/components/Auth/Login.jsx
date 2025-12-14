import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCandyCane, FaArrowRight } from 'react-icons/fa';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState({
        email: false,
        password: false
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            // Add success animation before navigation
            setTimeout(() => navigate('/dashboard'), 800);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4">
            {/* Main Card */}
            <div className="w-full max-w-md">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/20">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <FaCandyCane className="text-3xl text-white animate-bounce" />
                            <h1 className="text-3xl font-bold text-white tracking-tight">SweetShop</h1>
                        </div>
                        <p className="text-white/90 text-sm">Indulge in sweet delights</p>
                    </div>

                    {/* Form Container */}
                    <div className="p-6">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">
                                Welcome Back!
                            </h2>
                            <p className="text-gray-500 text-sm">Sign in to continue your sweet journey</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-shake">
                                <p className="text-red-600 text-sm text-center font-medium">{error}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => setIsFocused({...isFocused, email: true})}
                                        onBlur={() => setIsFocused({...isFocused, email: false})}
                                        required
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => setIsFocused({...isFocused, password: true})}
                                        onBlur={() => setIsFocused({...isFocused, password: false})}
                                        required
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                                {/* <div className="mt-1 text-right">
                                    <Link 
                                        to="/forgot-password" 
                                        className="text-sm text-purple-600 hover:text-purple-800 hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div> */}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:from-purple-700 hover:to-pink-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                                    <FaArrowRight />
                                </div>
                            </button>

                            {/* Divider */}
                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600 text-sm">
                                New to SweetShop?{' '}
                                <Link 
                                    to="/register" 
                                    className="font-semibold text-purple-600 hover:text-purple-800 hover:underline"
                                >
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;