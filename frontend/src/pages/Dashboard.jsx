/**
 * Dashboard Page
 * Main page showing all sweets with search, CRUD, purchase, and inventory operations
 */

import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import {
  getAllSweets,
  createSweet,
  updateSweet,
  deleteSweet,
  searchSweets,
} from '../services/sweets';

import { purchaseSweet, restockSweet } from '../services/inventory';

import SweetCard from '../components/Sweets/SweetCard';
import SearchBar from '../components/Sweets/SearchBar';
import SweetForm from '../components/Sweets/SweetForm';
import DeleteConfirmation from '../components/Sweets/DeleteConfirmation';
import PurchaseModal from '../components/Inventory/PurchaseModal';
import RestockModal from '../components/Inventory/RestockModal';
import SuccessModal from '../components/Inventory/SuccessModal';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // -------------------- State --------------------
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [showForm, setShowForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [deletingSweet, setDeletingSweet] = useState(null);
  const [purchasingSweet, setPurchasingSweet] = useState(null);
  const [restockingSweet, setRestockingSweet] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Search
  const [isSearching, setIsSearching] = useState(false);

  // -------------------- Effects --------------------
  useEffect(() => {
    loadSweets();
  }, []);

  // -------------------- API Calls --------------------
  const loadSweets = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllSweets();
      setSweets(data);
      setIsSearching(false);
    } catch (err) {
      setError('Failed to load sweets. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters) => {
    try {
      setLoading(true);
      setError('');
      const data = await searchSweets(filters);
      setSweets(data);
      setIsSearching(true);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => loadSweets();

  // -------------------- CRUD --------------------
  const handleAddSweet = () => {
    setEditingSweet(null);
    setShowForm(true);
  };

  const handleEditSweet = (sweet) => {
    setEditingSweet(sweet);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingSweet) {
        await updateSweet(editingSweet.id, formData);
      } else {
        await createSweet(formData);
      }
      setShowForm(false);
      setEditingSweet(null);
      loadSweets();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteSweet(deletingSweet.id);
      setDeletingSweet(null);
      loadSweets();
    } catch (err) {
      setError('Failed to delete sweet.');
      console.error(err);
    }
  };

  // -------------------- Purchase --------------------
  const handlePurchaseConfirm = async (quantity) => {
    try {
      const result = await purchaseSweet(purchasingSweet.id, quantity);
      setPurchasingSweet(null);

      setSuccessMessage({
        message: result.message,
        details: {
          Purchased: `${result.purchased_quantity} units`,
          'Total Cost': `$${result.total_cost.toFixed(2)}`,
          'Remaining Stock': `${result.remaining_quantity} units`,
        },
      });

      loadSweets();
    } catch (err) {
      throw err;
    }
  };

  // -------------------- Restock --------------------
  const handleRestockConfirm = async (quantity) => {
    try {
      const result = await restockSweet(restockingSweet.id, quantity);
      setRestockingSweet(null);

      setSuccessMessage({
        message: result.message,
        details: {
          Added: `+${result.added_quantity} units`,
          'Previous Stock': `${result.previous_quantity} units`,
          'New Stock': `${result.new_quantity} units`,
        },
      });

      loadSweets();
    } catch (err) {
      throw err;
    }
  };

  // -------------------- Auth --------------------
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // -------------------- Render --------------------
  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <h1>🍬 Sweet Shop</h1>
        <div className="nav-right">
          <span>
            Hello, <strong>{user?.username}</strong>
            {user?.is_admin && <span className="admin-badge">Admin</span>}
          </span>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="dashboard-content">
        <div className="content-header">
          <div>
            <h2>Sweet Collection</h2>
            <p className="subtitle">
              {isSearching ? 'Search Results' : 'Browse all available sweets'}
            </p>
          </div>

          {user?.is_admin && (
            <button className="btn-add-sweet" onClick={handleAddSweet}>
              ➕ Add New Sweet
            </button>
          )}
        </div>

        <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />

        {error && <div className="error-banner">⚠️ {error}</div>}

        {loading && (
          <div className="loading-container">
            <div className="spinner" />
            <p>Loading sweets...</p>
          </div>
        )}

        {!loading && sweets.length > 0 && (
          <div className="sweets-grid">
            {sweets.map((sweet) => (
              <SweetCard
                key={sweet.id}
                sweet={sweet}
                onEdit={handleEditSweet}
                onDelete={setDeletingSweet}
                onPurchase={setPurchasingSweet}
                onRestock={setRestockingSweet}
                isAdmin={user?.is_admin}
              />
            ))}
          </div>
        )}

        {!loading && sweets.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🍭</div>
            <h3>{isSearching ? 'No sweets found' : 'No sweets available'}</h3>
            <p>
              {isSearching
                ? 'Try adjusting your search filters'
                : user?.is_admin
                ? 'Click "Add New Sweet" to get started!'
                : 'Check back later for new sweets!'}
            </p>
            {isSearching && (
              <button className="btn-clear-search" onClick={handleClearSearch}>
                Show All Sweets
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <SweetForm
          sweet={editingSweet}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingSweet(null);
          }}
        />
      )}

      {deletingSweet && (
        <DeleteConfirmation
          sweet={deletingSweet}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingSweet(null)}
        />
      )}

      {purchasingSweet && (
        <PurchaseModal
          sweet={purchasingSweet}
          onConfirm={handlePurchaseConfirm}
          onCancel={() => setPurchasingSweet(null)}
        />
      )}

      {restockingSweet && (
        <RestockModal
          sweet={restockingSweet}
          onConfirm={handleRestockConfirm}
          onCancel={() => setRestockingSweet(null)}
        />
      )}

      {successMessage && (
        <SuccessModal
          message={successMessage.message}
          details={successMessage.details}
          onClose={() => setSuccessMessage(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
