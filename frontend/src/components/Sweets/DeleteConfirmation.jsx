import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const DeleteConfirmation = ({ sweet, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full border border-red-200 animate-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 rounded-t-2xl relative">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
          
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <FaExclamationTriangle className="text-4xl text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center">
            Delete Sweet?
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-700 text-lg mb-2">
              Are you sure you want to delete
            </p>
            <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              {sweet.name}?
            </p>
            <p className="text-gray-500 text-sm mt-3">
              This action cannot be undone. The sweet will be permanently removed from your collection.
            </p>
          </div>

          {/* Sweet Info Card */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 mb-6 border border-red-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Category:</span>
              <span className="font-semibold text-gray-800">{sweet.category}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600">Price:</span>
              <span className="font-semibold text-gray-800">${sweet.price}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600">Stock:</span>
              <span className="font-semibold text-gray-800">{sweet.quantity} units</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 border border-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;