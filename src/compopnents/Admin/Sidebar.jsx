// src/components/Admin/Sidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      label: "Manage Users",
      path: "/admin/users",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
    },
    {
      label: "Manage Products",
      path: "/admin/products",
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    },
    {
      label: "Manage Orders",
      path: "/admin/orders",
      icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
    },
    {
      label: "Manage Crops",
      path: "/admin/crops",
      icon: "M6 3v12a3 3 0 003 3h12M18 21V9a3 3 0 00-3-3H3",
    },
    {
      label: "Queries",
      path: "/admin/queries",
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    },
  ];

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   navigate("/login");
  // };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="sticky top-0 z-20 w-full md:w-64 bg-white border-r border-gray-200 p-4 md:p-6 h-screen overflow-y-hidden shadow-sm">
      <div className="w-full">
        <h2
          onClick={() => navigate("/admin")}
          className="text-xl font-bold text-gray-800 cursor-pointer mb-6 transition hover:text-indigo-600"
        >
          Admin Panel
        </h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ease-in-out text-sm md:text-base ${
                isActive(item.path)
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
            >
              <div className="flex items-center">
                <svg
                  className={`w-5 h-5 mr-3 ${
                    isActive(item.path) ? "text-white" : "text-gray-500"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={item.icon}
                  />
                </svg>
                {item.label}
              </div>
            </button>
          ))}
        </nav>

        {/* <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded-xl font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 ease-in-out text-sm md:text-base mt-4"
        >
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-3 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </div>
        </button> */}
      </div>
    </aside>
  );
};
