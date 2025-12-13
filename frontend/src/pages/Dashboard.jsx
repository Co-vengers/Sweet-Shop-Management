/**
 * Dashboard Page
 * Main page showing all sweets with search and CRUD operations
 */

import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  getAllSweets,
  createSweet,
  updateSweet,
  deleteSweet,
  searchSweets
} from '../services/sweets';

import SweetCard from '../components/Sweets/SweetCard';
import SearchBar from '../components/Sweets/SearchBar';
import SweetForm from '../components/Sweets/SweetForm';
import DeleteConfirmation from '../components/Sweets/DeleteConfirmation';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // State
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [deletingSweet, setDeletingSweet] = useState(null);

  // Search state
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadSweets();
  }, []);

  const loadSweets = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllSweets();
      setSweets(data);
      setIsSearching(false);
    } catch {
      setError('Failed to load sweets.');
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
    } catch {
      setError('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => loadSweets();

  const handleFormSubmit = async (formData) => {
    if (editingSweet) {
      await updateSweet(editingSweet.id, formData);
    } else {
      await createSweet(formData);
    }
    setShowForm(false);
    setEditingSweet(null);
    loadSweets();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-indigo-600">
            🍬 Sweet Shop
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              Hello, <strong>{user?.username}</strong>
              {user?.is_admin && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                  Admin
                </span>
              )}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Sweet Collection
            </h2>
            <p className="text-gray-600 mt-1">
              {isSearching ? 'Search results' : 'Browse all available sweets'}
            </p>
          </div>

          {user?.is_admin && (
            <button
              onClick={() => {
                setEditingSweet(null);
                setShowForm(true);
              }}
              className="mt-4 md:mt-0 px-5 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 transition shadow-md"
            >
              ➕ Add New Sweet
            </button>
          )}
        </div>

        {/* Search */}
        <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-lg font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mb-4" />
            <p className="text-gray-600">Loading sweets...</p>
          </div>
        )}

        {/* Grid */}
        {!loading && sweets.length > 0 && (
          <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {sweets.map((sweet) => (
              <SweetCard
                key={sweet.id}
                sweet={sweet}
                onEdit={() => {
                  setEditingSweet(sweet);
                  setShowForm(true);
                }}
                onDelete={() => setDeletingSweet(sweet)}
                isAdmin={user?.is_admin}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && sweets.length === 0 && (
          <div className="mt-16 text-center">
            <div className="text-6xl mb-4">🍭</div>
            <h3 className="text-xl font-semibold text-gray-900">
              {isSearching ? 'No sweets found' : 'No sweets available'}
            </h3>
            <p className="text-gray-600 mt-2">
              {isSearching
                ? 'Try adjusting your search filters.'
                : user?.is_admin
                  ? 'Start by adding a new sweet.'
                  : 'Check back later for new sweets!'}
            </p>

            {isSearching && (
              <button
                onClick={handleClearSearch}
                className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Show All Sweets
              </button>
            )}
          </div>
        )}
      </main>

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
          onConfirm={async () => {
            await deleteSweet(deletingSweet.id);
            setDeletingSweet(null);
            loadSweets();
          }}
          onCancel={() => setDeletingSweet(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
