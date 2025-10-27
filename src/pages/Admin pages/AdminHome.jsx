// src/pages/Admin/AdminHome.jsx (updated)
import React from "react";
import Chart from "react-apexcharts";
import { useQuery } from "@tanstack/react-query";
import { GetAll } from "../../compopnents/services/API/dashboardapi";
import { LatestOrders } from "../../compopnents/Admin/LatestOrder";

export const AdminHome = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["monthly-range-orders"],
    queryFn: GetAll,
  });

  const admin = JSON.parse(localStorage.getItem("admin") || "{}");
  const adminName = admin?.firstName
    ? `${admin.firstName} ${admin.lastName || ""}`.trim()
    : "Admin";

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  if (isError)
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <svg
          className="w-12 h-12 text-red-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-red-800 font-medium">
          Failed to load dashboard data
        </p>
      </div>
    );

  const series = [
    {
      name: "Orders",
      data: data?.data.map((item) => item.orders || 0),
    },
  ];

  const options = {
    chart: { type: "area", height: 350, toolbar: { show: false } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    xaxis: {
      categories: data?.data.map((item) => item._id),
      title: { text: "Date Range" },
      labels: { style: { colors: "#6b7280", fontSize: "12px" } },
    },
    yaxis: {
      title: { text: "Order Count" },
      min: 0,
      labels: { style: { colors: "#6b7280" } },
    },
    title: {
      text: "Monthly Orders by Date Range",
      align: "left",
      style: { fontSize: "18px", fontWeight: "700", color: "#1f2937" },
    },
    tooltip: {
      y: { formatter: (value) => `${value} orders` },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.4,
        gradientToColors: ["#818cf8"],
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    colors: ["#4f46e5"],
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
    },
  };

  const totalOrders =
    data?.data.reduce((sum, item) => sum + (item.orders || 0), 0) || 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Welcome back, {adminName}!
            </h1>
            <p className="text-indigo-100">
              Here's what's happening with your store today.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">
                {totalOrders.toLocaleString()}
              </div>
              <div className="text-indigo-100 text-sm">Total Orders</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Orders",
            value: totalOrders.toLocaleString(),
            icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
            color: "from-indigo-500 to-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            title: "Revenue Today",
            value: "$12,345",
            icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            color: "from-green-500 to-green-600",
            bg: "bg-green-50",
          },
          {
            title: "Order Growth",
            value: "+12.5%",
            icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
            color: "from-emerald-500 to-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            title: "Active Users",
            value: "3",
            icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
            color: "from-amber-500 to-amber-600",
            bg: "bg-amber-50",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <svg
                  className={`w-6 h-6 text-white bg-gradient-to-r ${stat.color} p-1 rounded-lg`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={stat.icon}
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h3>
            <p className="text-sm text-gray-500">Monthly order trends</p>
          </div>
          {/* <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
            View Report →
          </button> */}
        </div>
        <Chart options={options} series={series} type="area" height={350} />
      </div>

      {/* Latest Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Latest Orders</h3>
          {/* <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
            View All →
          </button> */}
        </div>
        <LatestOrders />
      </div>
    </div>
  );
};
