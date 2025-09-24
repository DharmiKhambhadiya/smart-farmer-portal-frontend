import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChangePassword } from "../compopnents/Account/changepassword";
import { Orders } from "../compopnents/Account/order";
import { Profile } from "../compopnents/Account/profile";
import { MyAddress } from "../compopnents/Account/myaddress";

export const Account = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const location = useLocation();

  // Handle tab selection from query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && ["profile", "orders", "address", "password"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear authentication token
    navigate("/login");
  };

  return (
    <div className="flex max-w-6xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      {/* Sidebar */}
      <div className="w-1/4 border-r pr-4">
        <ul className="space-y-3">
          <li>
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left p-3 rounded-lg ${
                activeTab === "profile"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              👤 Profile
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left p-3 rounded-lg ${
                activeTab === "orders"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              🛒 My Orders
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("address")}
              className={`w-full text-left p-3 rounded-lg ${
                activeTab === "address"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              📍 My Address
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("password")}
              className={`w-full text-left p-3 rounded-lg ${
                activeTab === "password"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              🔑 Change Password
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full text-left p-3 rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              🚪 Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 pl-6">
        {activeTab === "profile" && <Profile />}
        {activeTab === "orders" && <Orders />}
        {activeTab === "address" && <MyAddress />}
        {activeTab === "password" && <ChangePassword />}
      </div>
    </div>
  );
};
