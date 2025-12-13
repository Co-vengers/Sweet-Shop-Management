/**
 * Dashboard Page
 * Main page after login
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
            
            {/* .dashboard-header */}
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-indigo-600">🍬 Sweet Shop Dashboard</h1>

                    <div className="user-actions flex items-center space-x-4">
                        <span className="text-gray-700 font-medium">Hello, {user?.username}!</span>
                        <button 
                            onClick={handleLogout}
                            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition duration-150"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* .dashboard-content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:p-0">
                    <div className="bg-white shadow-xl rounded-lg p-6 mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome to Sweet Shop! 🎉</h2>
                        <p className="text-gray-600">Your authentication is working perfectly. You are safely logged in.</p>
                    </div>

                    {/* .profile-section */}
                    <section className="bg-white shadow-lg rounded-lg p-6 mb-8 border-l-4 border-indigo-500">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Profile Details</h3>
                        <div className="space-y-2 text-gray-700">
                            <p>
                                <strong>Email:</strong> <span className="font-mono">{user?.email}</span>
                            </p>
                            <p>
                                <strong>Username:</strong> <span className="font-mono">{user?.username}</span>
                            </p>
                            <p>
                                <strong>Admin Status:</strong>{' '}
                                <span className={`font-bold ${user?.is_admin ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {user?.is_admin ? 'Yes' : 'No'}
                                </span>
                            </p>
                        </div>
                    </section>

                    {/* .next-steps */}
                    <section className="bg-white shadow-lg rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Next Steps in Development</h3>
                        <ul className="space-y-3 text-gray-700 list-inside">
                            <li className="flex items-center">
                                <span className="text-green-500 mr-2">✅</span> Authentication system is complete and secure.
                            </li>
                            <li className="flex items-center">
                                <span className="text-yellow-500 mr-2">⏳</span> **Next:** Implement the Sweets management (CRUD) UI.
                            </li>
                            <li className="flex items-center">
                                <span className="text-yellow-500 mr-2">⏳</span> **Then:** Add inventory tracking and reporting features.
                            </li>
                        </ul>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
