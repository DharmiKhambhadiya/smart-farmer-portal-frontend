// src/components/Admin/UserDetailsModal.jsx
import { XMarkIcon } from "@heroicons/react/24/solid";

export const UserDetailsModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">User Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Email", value: user.email },
              { label: "First Name", value: user.firstName || "-" },
              { label: "Last Name", value: user.lastName || "-" },
              { label: "City", value: user.city || "-" },
              { label: "Phone Number", value: user.phoneNumber || "-" },
              { label: "Role", value: user.role },
              { label: "Verified", value: user.isVerified ? "Yes" : "No" },
            ].map((field, index) => (
              <div key={index} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <p className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800">
                  {field.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Compact Right-Aligned Button */}
        <div className="px-6 py-5 border-t border-gray-100 bg-white">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
