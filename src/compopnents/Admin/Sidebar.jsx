// src/components/Admin/Sidebar.jsx
import { useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/admin");
  };

  const menuItems = [
    { label: "Manage Users", path: "/admin/users" },
    { label: "Manage Products", path: "/admin/products" },
    { label: "Manage Orders", path: "/admin/orders" },
    { label: "Manage Crops", path: "/admin/crops" },
    { label: "Queries", path: "/admin/queries" },
  ];

  return (
    <aside className="sticky top-0 z-20 w-full md:w-64 bg-white border-r border-gray-200 p-4 md:p-6 h-screen overflow-y-auto shadow-sm">
      <div className="w-full">
        <h2
          onClick={handleLogoClick}
          className="text-xl font-bold text-gray-800 cursor-pointer mb-6 transition hover:text-indigo-600"
        >
          Admin Panel
        </h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full text-left px-4 py-3 rounded-xl font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 focus:bg-indigo-100 transition-all duration-200 ease-in-out text-sm md:text-base"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};
