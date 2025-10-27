// src/components/Admin/Header.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const admin = JSON.parse(localStorage.getItem("admin") || "{}");
  const adminName = admin?.firstName
    ? `${admin.firstName} ${admin.lastName || ""}`.trim()
    : "Admin";

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                {/* Clickable Logo */}
                <div
                  onClick={() => navigate("/admin")}
                  className="flex items-center gap-3 cursor-pointer group transition-all duration-300 hover:scale-105"
                >
                  <img
                    src="/images/logo.png"
                    alt="Smart Farmer Logo"
                    className="w-12 h-12 object-contain rounded-full shadow-glow transition-all duration-300 group-hover:shadow-accent/50"
                  />
                  {/* Optional: Uncomment to show text next to logo */}
                  {/* <span className="text-2xl font-bold text-black">
                    SMART FARMER
                  </span> */}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Profile & Notifications */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none">
              {/* Notification icon (optional) */}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {adminName}
                </span>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {adminName.charAt(0).toUpperCase()}
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/login");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors duration-150"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
