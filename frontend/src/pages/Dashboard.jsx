/**
 * Dashboard Page
 * Main page after login
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🍬 Sweet Shop</h1>

        <div className="user-actions">
          <span>Hello, {user?.username}!</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-content">
        <h2>Welcome to Sweet Shop! 🎉</h2>
        <p>Your authentication is working perfectly!</p>

        <section className="profile-section">
          <h3>Your Profile</h3>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Username:</strong> {user?.username}</p>
          <p>
            <strong>Admin:</strong>{' '}
            {user?.is_admin ? 'Yes' : 'No'}
          </p>
        </section>

        <section className="next-steps">
          <h3>Next Steps</h3>
          <ul>
            <li>✅ Authentication is complete</li>
            <li>⏳ Next: Build the Sweets management system</li>
            <li>⏳ Then: Add inventory management</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
