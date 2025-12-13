/**
 * RestockModal Component
 * Modal for restocking sweets (Admin only)
 */

import { useState, useEffect, useMemo } from 'react';

const RestockModal = ({ sweet, onConfirm, onCancel }) => {
  const [quantity, setQuantity] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /* Reset modal state when sweet changes */
  useEffect(() => {
    setQuantity(10);
    setError('');
    setLoading(false);
  }, [sweet]);

  /**
   * Calculate new total stock safely
   */
  const newQuantity = useMemo(() => {
    if (!sweet) return 0;
    return sweet.quantity + quantity;
  }, [sweet, quantity]);

  /**
   * Handle quantity input change
   */
  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);

    if (Number.isNaN(value)) {
      setQuantity(1);
      return;
    }

    if (value < 1) {
      setQuantity(1);
      setError('');
      return;
    }

    setQuantity(value);
    setError('');
  };

  /**
   * Handle restock submit
   */
  const handleRestock = async () => {
    if (quantity < 1) {
      setError('Quantity must be greater than 0');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onConfirm(quantity);
    } catch (err) {
      setError(err?.message || 'Restock failed. Please try again.');
      setLoading(false);
    }
  };

  if (!sweet) return null;

  return (
    <div className="restock-overlay">
      <div className="restock-modal">
        {/* Header */}
        <div className="restock-header">
          <h2>📦 Restock Sweet</h2>
          <button
            className="btn-close"
            onClick={onCancel}
            disabled={loading}
          >
            ✖️
          </button>
        </div>

        {/* Content */}
        <div className="restock-content">
          {/* Sweet Info */}
          <div className="sweet-info">
            <h3>{sweet.name}</h3>
            <p className="sweet-category">{sweet.category}</p>
            <p className="sweet-stock">
              Current Stock:{' '}
              <strong>{sweet.quantity}</strong> units
            </p>
            <p className="sweet-stock new">
              New Stock After Restock:{' '}
              <strong>{newQuantity}</strong> units
            </p>
          </div>

          {/* Quantity Input */}
          <div className="quantity-input">
            <label htmlFor="restock-quantity">
              Quantity to Add
            </label>

            <div className="quantity-controls">
              <button
                type="button"
                className="btn-quantity"
                onClick={() => setQuantity(q => Math.max(1, q - 10))}
                disabled={loading}
              >
                −10
              </button>

              <button
                type="button"
                className="btn-quantity"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={loading}
              >
                −1
              </button>

              <input
                type="number"
                id="restock-quantity"
                value={quantity}
                min="1"
                onChange={handleQuantityChange}
                disabled={loading}
              />

              <button
                type="button"
                className="btn-quantity"
                onClick={() => setQuantity(q => q + 1)}
                disabled={loading}
              >
                +1
              </button>

              <button
                type="button"
                className="btn-quantity"
                onClick={() => setQuantity(q => q + 10)}
                disabled={loading}
              >
                +10
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="error-message">{error}</div>
          )}
        </div>

        {/* Actions */}
        <div className="restock-actions">
          <button
            className="btn-cancel-restock"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="btn-confirm-restock"
            onClick={handleRestock}
            disabled={loading || quantity < 1}
          >
            {loading ? 'Restocking…' : `Restock +${quantity}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestockModal;
