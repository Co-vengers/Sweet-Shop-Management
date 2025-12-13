/**
 * SearchBar Component
 * Allows users to search and filter sweets (Modern Tailwind UI)
 */

import { useState } from 'react';

const SearchBar = ({ onSearch, onClear }) => {
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    min_price: '',
    max_price: '',
  });

  const categories = [
    'All',
    'Chocolate',
    'Gummy',
    'Hard Candy',
    'Lollipop',
    'Sour',
    'Other',
  ];

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handle search
   */
  const handleSearch = (e) => {
    e.preventDefault();

    const searchFilters = {};
    if (filters.name) searchFilters.name = filters.name;
    if (filters.category) searchFilters.category = filters.category;
    if (filters.min_price) searchFilters.min_price = filters.min_price;
    if (filters.max_price) searchFilters.max_price = filters.max_price;

    onSearch(searchFilters);
  };

  /**
   * Handle clear
   */
  const handleClear = () => {
    setFilters({
      name: '',
      category: '',
      min_price: '',
      max_price: '',
    });
    onClear();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <form onSubmit={handleSearch} className="space-y-6">

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              🔍 Search by Name
            </label>
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleChange}
              placeholder="Chocolate, Gummy..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                         transition"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              📂 Category
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                         transition bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat === 'All' ? '' : cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Min Price */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              💰 Min Price
            </label>
            <input
              type="number"
              name="min_price"
              value={filters.min_price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                         transition"
            />
          </div>

          {/* Max Price */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              💰 Max Price
            </label>
            <input
              type="number"
              name="max_price"
              value={filters.max_price}
              onChange={handleChange}
              placeholder="100.00"
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                         transition"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold
                       hover:bg-gray-200 transition"
          >
            ✖️ Clear
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-700
                       text-white font-semibold shadow-md
                       hover:from-indigo-700 hover:to-purple-800 transition"
          >
            🔍 Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
