// src/components/Admin/UserDetailsModal.jsx
import {
  XMarkIcon,
  UserCircleIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export const UserDetailsModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  const getRoleBadge = (role) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    if (role === "admin") {
      return `${baseClasses} bg-red-100 text-red-800`;
    }
    return `${baseClasses} bg-blue-100 text-blue-800`;
  };

  const getVerifiedIcon = (isVerified) => {
    if (isVerified) {
      return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
    }
    return <XCircleIcon className="w-5 h-5 text-red-600" />;
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`✅ ${label} copied to clipboard!`, {
          duration: 2000,
          icon: "📋",
        });
      })
      .catch(() => {
        toast.error(`❌ Failed to copy ${label}`, {
          duration: 2000,
          icon: "❌",
        });
      });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
              <UserCircleIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">User Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-200"
            aria-label="Close"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* User Info Card */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                  <UserCircleIcon className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {user.firstName || ""} {user.lastName || ""}
                  </h3>
                  <p className="text-blue-600 font-medium break-all">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => copyToClipboard(user.email, "Email")}
                  className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                >
                  <ClipboardDocumentIcon className="w-4 h-4" />
                  Copy Email
                </button>
                {user.phoneNumber && (
                  <button
                    onClick={() => copyToClipboard(user.phoneNumber, "Phone")}
                    className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                  >
                    <ClipboardDocumentIcon className="w-4 h-4" />
                    Copy Phone
                  </button>
                )}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  label: "Email",
                  value: user.email,
                  icon: EnvelopeIcon,
                  copyable: true,
                },
                {
                  label: "First Name",
                  value: user.firstName || "-",
                  icon: UserCircleIcon,
                },
                {
                  label: "Last Name",
                  value: user.lastName || "-",
                  icon: UserCircleIcon,
                },
                {
                  label: "City",
                  value: user.city || "-",
                  icon: BuildingOfficeIcon,
                },
                {
                  label: "Phone Number",
                  value: user.phoneNumber || "-",
                  icon: PhoneIcon,
                  copyable: !!user.phoneNumber,
                },
                {
                  label: "Role",
                  value: (
                    <span className={getRoleBadge(user.role)}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  ),
                  icon: ShieldCheckIcon,
                },
                {
                  label: "Verified",
                  value: getVerifiedIcon(user.isVerified),
                  icon: CheckCircleIcon,
                },
                {
                  label: "User ID",
                  value: user._id,
                  icon: UserCircleIcon,
                  copyable: true,
                },
              ].map((field, index) => (
                <div key={index} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <field.icon className="w-4 h-4 text-gray-500" />
                    {field.label}
                    {field.copyable && (
                      <button
                        onClick={() =>
                          copyToClipboard(field.value, field.label)
                        }
                        className="ml-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                        title={`Copy ${field.label}`}
                      >
                        <ClipboardDocumentIcon className="w-3 h-3" />
                      </button>
                    )}
                  </label>
                  <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 break-all">
                    {field.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-6 py-5 border-t border-gray-200 bg-white">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
