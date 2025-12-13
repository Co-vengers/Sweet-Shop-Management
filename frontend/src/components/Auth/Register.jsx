/**
 * Register Component
 * Allows new users to create an account
 */

import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password2: '',
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: '',
      general: '',
    });
  };

  /**
   * Validate form data
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    }

    if (!formData.username) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.password2) {
      newErrors.password2 = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    const result = await register(formData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors({ general: result.error });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 to-purple-600">
            
            {/* .auth-card */}
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                
                {/* Titles */}
                <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">🍬 Join Sweet Shop!</h2>
                <p className="text-center text-gray-500 mb-8">Create your account</p>

                {/* .error-message (General Error) */}
                {errors.general && (
                    <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-5 font-medium">
                        {errors.general}
                    </p>
                )}

                {/* .auth-form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Form Groups */}
                    {['email', 'username', 'password', 'password2'].map((field) => (
                        <div key={field} className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 capitalize">
                                {field === 'password2' ? 'Confirm Password' : field}
                            </label>
                            <input
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                type={field.includes('password') ? 'password' : field.includes('email') ? 'email' : 'text'}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                required
                            />
                            {/* .field-error */}
                            {errors[field] && (
                                <span className="text-sm text-red-500 font-medium">{errors[field]}</span>
                            )}
                        </div>
                    ))}

                    {/* .btn-primary */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-800 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                {/* .auth-footer */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
