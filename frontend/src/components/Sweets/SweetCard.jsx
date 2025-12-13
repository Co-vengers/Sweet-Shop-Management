/**
 * SweetCard Component
 * Displays a single sweet in a modern card format (Tailwind UI)
 */

const SweetCard = ({
  sweet,
  onEdit,
  onDelete,
  onPurchase,
  onRestock,
  isAdmin,
}) => {
  /**
   * Get emoji based on category
   */
  const getCategoryEmoji = (category) => {
    const emojis = {
      Chocolate: '🍫',
      Gummy: '🐻',
      'Hard Candy': '🍬',
      Lollipop: '🍭',
      Sour: '🍋',
      Other: '🍰',
    };
    return emojis[category] || '🍬';
  };

  /**
   * Stock badge styles
   */
  const getStockBadge = () => {
    if (sweet.quantity === 0) {
      return 'bg-red-100 text-red-700';
    }
    if (sweet.quantity < 10) {
      return 'bg-yellow-100 text-yellow-700';
    }
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-200 overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-50 to-purple-50">
        <span className="text-3xl">{getCategoryEmoji(sweet.category)}</span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStockBadge()}`}
        >
          {sweet.quantity === 0
            ? 'Out of Stock'
            : `${sweet.quantity} in stock`}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 space-y-3">
        <h3 className="text-xl font-bold text-gray-900">
          {sweet.name}
        </h3>

        <p className="text-sm text-gray-500">{sweet.category}</p>

        {sweet.description && (
          <p className="text-gray-600 text-sm line-clamp-2">
            {sweet.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="text-2xl font-extrabold text-indigo-600">
            ${parseFloat(sweet.price).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pb-5">
        {isAdmin ? (
          <div className="flex gap-3">
            {/* Edit */}
            <button
              onClick={() => onEdit(sweet)}
              className="flex-1 py-2 rounded-lg bg-indigo-100 text-indigo-700 font-semibold hover:bg-indigo-200 transition"
            >
              ✏️ Edit
            </button>

            {/* Restock */}
            <button
              onClick={() => onRestock(sweet)}
              className="flex-1 py-2 rounded-lg bg-emerald-100 text-emerald-700 font-semibold hover:bg-emerald-200 transition"
            >
              📦 Restock
            </button>

            {/* Delete */}
            <button
              onClick={() => onDelete(sweet)}
              className="flex-1 py-2 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition"
            >
              🗑️ Delete
            </button>
          </div>
        ) : (
          <button
            onClick={() => onPurchase(sweet)}
            disabled={sweet.quantity === 0}
            className={`w-full py-2 rounded-lg font-semibold transition ${
              sweet.quantity === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white hover:from-indigo-700 hover:to-purple-800'
            }`}
          >
            {sweet.quantity === 0 ? '❌ Out of Stock' : '🛒 Purchase'}
          </button>
        )}
      </div>
    </div>
  );
};

export default SweetCard;
