/**
 * Dashboard Page - Candy Theme
 * Main page showing all sweets with search, CRUD, purchase, and inventory operations
 */

import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  FaCandyCane, 
  FaUser, 
  FaSignOutAlt, 
  FaPlus, 
  FaSearch,
  FaSpinner,
  FaExclamationTriangle
} from 'react-icons/fa';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md shadow-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center gap-2">
                <FaCandyCane className="text-2xl text-purple-600 animate-bounce" />
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  SweetShop
                </span>
              </div>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Hello, <span className="font-semibold text-gray-800">{user?.username}</span>
                  </p>
                  {user?.is_admin && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-sm">
                      Admin
                    </span>
                  )}
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                  <FaUser className="text-sm" />
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                <FaSignOutAlt className="text-sm" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8 border border-purple-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">
                Sweet Collection
              </h2>
              <p className="text-gray-600">
                {isSearching ? '🔍 Search Results' : '🍬 Browse all available sweets'}
              </p>
            </div>

            {user?.is_admin && (
              <button
                onClick={handleAddSweet}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <FaPlus className="text-sm" />
                <span>Add New Sweet</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3 animate-shake">
            <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <FaSpinner className="text-6xl text-purple-600 animate-spin" />
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading delicious sweets...</p>
          </div>
        )}

        {/* Sweets Grid */}
        {!loading && sweets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

        {/* Empty State */}
        {!loading && sweets.length === 0 && (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-12 text-center border border-purple-100">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-6xl">🍭</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {isSearching ? 'No sweets found' : 'No sweets available'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {isSearching
                ? 'Try adjusting your search filters to find what you\'re looking for'
                : user?.is_admin
                ? 'Click "Add New Sweet" to start building your collection!'
                : 'Check back soon for new sweet treats!'}
            </p>
            {isSearching && (
              <button
                onClick={handleClearSearch}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-md font-semibold"
              >
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