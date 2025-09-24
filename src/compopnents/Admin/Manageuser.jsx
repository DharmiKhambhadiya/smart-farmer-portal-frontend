// src/components/Admin/Manageuser.jsx (EditUserModal)
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUpdateUser } from "../services/API/userapi";
import toast from "react-hot-toast";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

export const EditUserModal = ({ isOpen, onClose, user }) => {
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
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: ({ id, data }) => adminUpdateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("✅ User updated successfully", { duration: 3000 });
      onClose();
    },
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || "Failed to update user";
      toast.error(`❌ ${errorMessage}`, { duration: 4000 });
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

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
      newErrors.phoneNumber = "Invalid phone number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors below ⚠️");
      return;
    }
    mutation.mutate({ id: user._id, data: formData });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* Modal Card */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Edit User</h2>
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { label: "First Name", name: "firstName", type: "text" },
              { label: "Last Name", name: "lastName", type: "text" },
              { label: "City", name: "city", type: "text" },
              { label: "Phone Number", name: "phoneNumber", type: "text" },
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-0 transition
                    ${
                      errors[field.name]
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300 focus:border-indigo-500"
                    }`}
                />
                {errors[field.name] && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                    <XMarkIcon className="w-4 h-4" />
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}

            {/* Role Select */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 hover:border-gray-300 transition"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Verified Checkbox */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl w-fit">
              <input
                type="checkbox"
                name="isVerified"
                checked={formData.isVerified}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="text-sm font-medium text-gray-700">
                Verified User
              </label>
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email (Read-only)
              </label>
              <input
                type="email"
                value={formData.email || ""}
                disabled
                className="w-full px-4 py-2.5 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* ✅ Compact Right-Aligned Buttons */}
            <div className="flex justify-end gap-3 pt-2 mt-4 border-t border-gray-100 -mx-6 px-6 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={mutation.isLoading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg flex items-center gap-1.5 transition
                  ${
                    mutation.isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
              >
                {mutation.isLoading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    Save
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
