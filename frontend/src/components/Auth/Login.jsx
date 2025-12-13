// src/components/Auth/Login.jsx

import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
// The external CSS import was correctly removed for Tailwind

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    // 1. Form state
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // 2. UI state (This defines 'error' and 'loading')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    /**
     * Handle input changes
     */
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            // result.error is set by the AuthContext provider
            setError(result.error); 
        }

        setLoading(false);
    };

    return (
        // .auth-container
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 to-purple-600">
            
            {/* .auth-card - Added Card Structure */}
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                
                {/* Titles */}
                <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">🍬 Welcome Back!</h2>
                <p className="text-center text-gray-500 mb-8">Login to Sweet Shop</p>

                {/* .error-message - FIX: Changed the className to use Tailwind utilities */}
                {error && (
                    <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-5 font-medium">
                        {error}
                    </p>
                )}

                {/* .auth-form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* .form-group for Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* .form-group for Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* .btn-primary */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-800 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {/* .auth-footer */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;