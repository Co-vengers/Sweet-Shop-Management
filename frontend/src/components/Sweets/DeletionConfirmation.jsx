/**
 * DeleteConfirmation Component
 * Modern Tailwind-based modal for confirming sweet deletion
 */

const DeleteConfirmation = ({ sweet, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex flex-col items-center px-6 pt-6">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 text-3xl mb-4">
            ⚠️
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            Delete Sweet?
          </h2>

          <p className="text-center text-gray-600 mt-3">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-900">
              {sweet.name}
            </span>
            ?
            <br />
            <span className="text-sm text-red-600 font-medium">
              This action cannot be undone.
            </span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 px-6 py-6 mt-4 bg-gray-50">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition shadow-md"
          >
            Yes, Delete
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteConfirmation;
