// src/pages/Admin/AdminHome.jsx
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

  if (isLoading)
    return <div className="p-8 text-center">Loading dashboard...</div>;
  if (isError)
    return (
      <div className="p-8 text-center text-red-600">Failed to load data</div>
    );

  const series = [
    {
      name: "Orders",
      data: data?.data.map((item) => item.orders || 0),
    },
  ];

  const options = {
    chart: { type: "area", height: 350, toolbar: { show: false } }, // Hide toolbar for cleaner look
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
      style: { fontSize: "18px", fontWeight: "600", color: "#1f2937" },
    },
    tooltip: {
      y: { formatter: (value) => `${value} orders` },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.8,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    colors: ["#4f46e5"], // Indigo primary
  };

  const totalOrders =
    data?.data.reduce((sum, item) => sum + (item.orders || 0), 0) || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Here’s what’s happening today.
        </p>
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
        </div>
        <Chart options={options} series={series} type="area" height={350} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat 1: Total Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-indigo-50">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalOrders.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Stat 2: Revenue Today */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-green-50">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Revenue Today</p>
              <p className="text-2xl font-bold text-gray-900">$12,345</p>
            </div>
          </div>
        </div>

        {/* Stat 3: Growth */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-amber-50">
              <svg
                className="w-6 h-6 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Order Growth</p>
              <p className="text-2xl font-bold text-gray-900">+12.5%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Latest Orders
        </h3>
        <LatestOrders />
      </div>
    </div>
  );
};
