/**
 * PurchaseModal Component
 * Modal for purchasing sweets
 */

import { useState, useEffect, useMemo } from 'react';
import './PurchaseModal.css';

const PurchaseModal = ({ sweet, onConfirm, onCancel }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /* Reset state when modal opens for a new sweet */
  useEffect(() => {
    setQuantity(1);
    setError('');
    setLoading(false);
  }, [sweet]);

  /**
   * Calculate total cost safely
   */
  const totalCost = useMemo(() => {
    if (!sweet) return '0.00';
    return (Number(sweet.price) * quantity).toFixed(2);
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

    if (value > sweet.quantity) {
      setQuantity(sweet.quantity);
      setError(`Only ${sweet.quantity} units available`);
      return;
    }

    setQuantity(value);
    setError('');
  };

  /**
   * Handle purchase
   */
  const handlePurchase = async () => {
    if (quantity < 1 || quantity > sweet.quantity) {
      setError('Invalid quantity selected');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onConfirm(quantity);
    } catch (err) {
      setError(err?.message || 'Purchase failed. Please try again.');
      setLoading(false);
    }
  };

  if (!sweet) return null;

  return (
    <div className="purchase-overlay">
      <div className="purchase-modal">
        {/* Header */}
        <div className="purchase-header">
          <h2>🛒 Purchase Sweet</h2>
          <button
            className="btn-close"
            onClick={onCancel}
            disabled={loading}
          >
            ✖️
          </button>
        </div>

        {/* Content */}
        <div className="purchase-content">
          {/* Sweet Info */}
          <div className="sweet-info">
            <h3>{sweet.name}</h3>
            <p className="sweet-category">{sweet.category}</p>
            <p className="sweet-stock">
              {sweet.quantity} units available
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity</label>
            <div className="quantity-controls">
              <button
                type="button"
                className="btn-quantity"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1 || loading}
              >
                −
              </button>

              <input
                type="number"
                id="quantity"
                value={quantity}
                min="1"
                max={sweet.quantity}
                onChange={handleQuantityChange}
                disabled={loading}
              />

              <button
                type="button"
                className="btn-quantity"
                onClick={() => setQuantity(q => Math.min(sweet.quantity, q + 1))}
                disabled={quantity >= sweet.quantity || loading}
              >
                +
              </button>
            </div>
          </div>

          {/* Price Info */}
          <div className="price-info">
            <div className="price-row">
              <span>Unit Price</span>
              <span className="price">
                ₹{Number(sweet.price).toFixed(2)}
              </span>
            </div>
            <div className="price-row total">
              <span>Total</span>
              <span className="price">₹{totalCost}</span>
            </div>
          </div>

          {/* Error */}
          {error && <div className="error-message">{error}</div>}
        </div>

        {/* Actions */}
        <div className="purchase-actions">
          <button
            className="btn-cancel-purchase"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="btn-confirm-purchase"
            onClick={handlePurchase}
            disabled={loading || quantity < 1 || quantity > sweet.quantity}
          >
            {loading ? 'Processing…' : `Purchase (₹${totalCost})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
