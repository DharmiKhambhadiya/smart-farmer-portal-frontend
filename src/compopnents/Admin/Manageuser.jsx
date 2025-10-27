// src/components/Admin/Manageuser.jsx
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUpdateUser } from "../services/API/userapi";
import toast from "react-hot-toast";
import {
  CheckIcon,
  XMarkIcon,
  UserCircleIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export const EditUserModal = ({ isOpen, onClose, user, onSuccess }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    city: "",
    phoneNumber: "",
    role: "user",
    email: "",
    isVerified: false,
  });

  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        city: user.city || "",
        phoneNumber: user.phoneNumber || "",
        role: user.role || "user",
        email: user.email || "",
        isVerified: user.isVerified || false,
      });
      setErrors({});
      setIsDirty(false);
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: ({ id, data }) => adminUpdateUser(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries(["users"]);

      // Success toast with user info
      toast.success(
        ` ${response.data.firstName || user.email} updated successfully!`,
        {
          duration: 3000,
          icon: "✅",
        }
      );

      onSuccess?.();
      onClose();
    },
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || "Failed to update user";

      // Different error messages based on error type
      if (err.response?.status === 409) {
        toast.error(` ${errorMessage}`, {
          duration: 5000,
          icon: "⚠️",
        });
      } else if (err.response?.status === 400) {
        toast.error(` Validation error: ${errorMessage}`, {
          duration: 5000,
          icon: "❌",
        });
      } else {
        toast.error(` Failed to update user: ${errorMessage}`, {
          duration: 5000,
          icon: "❌",
        });
      }
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setIsDirty(true);

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    if (formData.phoneNumber && !/^\d{10,15}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Phone number must be 10-15 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isDirty) {
      toast("ℹNo changes detected", {
        duration: 2000,
        icon: "ℹ️",
      });
      return;
    }

    if (!validateForm()) {
      toast.error(" Please fix the errors below", {
        duration: 3000,
        icon: "❌",
      });
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading("Updating user...");

    mutation.mutate({ id: user._id, data: formData });
  };

  const handleCancel = () => {
    if (isDirty) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to cancel?"
        )
      ) {
        onClose();
        toast("ℹChanges discarded", {
          duration: 2000,
          icon: "🗑️",
        });
      }
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Modal Card */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <UserCircleIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Edit User: {user?.firstName || user?.email}
            </h2>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-200"
            aria-label="Close"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <UserCircleIcon className="w-4 h-4 text-gray-500" />
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200
                    ${
                      errors.firstName
                        ? "border-red-500 bg-red-50 focus:border-red-500"
                        : "border-gray-200 hover:border-gray-300 focus:border-indigo-500"
                    }`}
                />
                {errors.firstName && (
                  <div className="flex items-center gap-1 text-sm text-red-600 font-medium">
                    <ExclamationCircleIcon className="w-4 h-4" />
                    {errors.firstName}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <UserCircleIcon className="w-4 h-4 text-gray-500" />
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200
                    ${
                      errors.lastName
                        ? "border-red-500 bg-red-50 focus:border-red-500"
                        : "border-gray-200 hover:border-gray-300 focus:border-indigo-500"
                    }`}
                />
                {errors.lastName && (
                  <div className="flex items-center gap-1 text-sm text-red-600 font-medium">
                    <ExclamationCircleIcon className="w-4 h-4" />
                    {errors.lastName}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <BuildingOfficeIcon className="w-4 h-4 text-gray-500" />
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200
                    ${
                      errors.city
                        ? "border-red-500 bg-red-50 focus:border-red-500"
                        : "border-gray-200 hover:border-gray-300 focus:border-indigo-500"
                    }`}
                />
                {errors.city && (
                  <div className="flex items-center gap-1 text-sm text-red-600 font-medium">
                    <ExclamationCircleIcon className="w-4 h-4" />
                    {errors.city}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4 text-gray-500" />
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200
                    ${
                      errors.phoneNumber
                        ? "border-red-500 bg-red-50 focus:border-red-500"
                        : "border-gray-200 hover:border-gray-300 focus:border-indigo-500"
                    }`}
                />
                {errors.phoneNumber && (
                  <div className="flex items-center gap-1 text-sm text-red-600 font-medium">
                    <ExclamationCircleIcon className="w-4 h-4" />
                    {errors.phoneNumber}
                  </div>
                )}
              </div>
            </div>

            {/* Role Select */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-gray-500" />
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 hover:border-gray-300 transition-all duration-200 bg-white"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Verified Checkbox */}
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <input
                type="checkbox"
                name="isVerified"
                checked={formData.isVerified}
                onChange={handleChange}
                className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-green-600" />
                Verified User
              </label>
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                Email (Read-only)
              </label>
              <input
                type="email"
                value={formData.email || ""}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isLoading}
                className={`px-5 py-2.5 text-sm font-medium text-white rounded-xl flex items-center gap-2 transition-all duration-200 hover:shadow-lg
                  ${
                    mutation.isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  }`}
              >
                {mutation.isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
