// src/pages/Admin/Dashboard.jsx
import { Outlet } from "react-router-dom";
import { Sidebar } from "../../compopnents/Admin/Sidebar";

export const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
