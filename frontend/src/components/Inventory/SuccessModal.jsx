/**
 * SuccessModal Component
 * Shows success message after purchase or restock
 */

import './SuccessModal.css';

const formatLabel = (key) =>
  key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const SuccessModal = ({ message, details = {}, onClose }) => {
  if (!message) return null;

  return (
    <div className="success-overlay">
      <div className="success-modal">
        {/* Icon */}
        <div className="success-icon">✅</div>

        {/* Title */}
        <h2>Success!</h2>

        {/* Message */}
        <p className="success-message">{message}</p>

        {/* Details */}
        {Object.keys(details).length > 0 && (
          <div className="success-details">
            {Object.entries(details).map(([key, value]) => (
              <div key={key} className="detail-row">
                <span className="detail-label">
                  {formatLabel(key)}:
                </span>
                <span className="detail-value">{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action */}
        <button
          className="btn-close-success"
          onClick={onClose}
          autoFocus
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
