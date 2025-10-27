// src/components/Admin/LatestOrder.jsx
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLatestOrders } from "../services/API/dashboardapi";
import {
  ShoppingBagIcon,
  UserIcon,
  CurrencyRupeeIcon,
  ClockIcon,
  TruckIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

export const LatestOrders = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["latest-orders"],
    queryFn: () => getLatestOrders({ limit: 5, page: 1 }),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "text-green-600 bg-green-100 border-green-200";
      case "shipped":
        return "text-blue-600 bg-blue-100 border-blue-200";
      case "processing":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckBadgeIcon className="w-3 h-3" />;
      case "shipped":
        return <TruckIcon className="w-3 h-3" />;
      case "processing":
        return <ClockIcon className="w-3 h-3" />;
      default:
        return <ClockIcon className="w-3 h-3" />;
    }
  };

  const getUserName = (user) => {
    if (!user) return "Unknown User";
    const { firstName = "", lastName = "" } = user;
    return `${firstName} ${lastName}`.trim() || "Unknown User";
  };

  const getOrderItemsPreview = (orderitems) => {
    if (!orderitems || !Array.isArray(orderitems) || orderitems.length === 0) {
      return "No items";
    }
    const previewItems = orderitems.slice(0, 2).map((item) => {
      if (!item || !item.name) return "Unknown item";
      return `${item.name} (x${item.quantity || 1})`;
    });
    return previewItems.join(", ");
  };

  // Memoize orders to prevent unnecessary re-renders
  const orders = useMemo(() => data?.data || [], [data]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="w-24 h-5 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <ExclamationCircleIcon className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            Error loading orders
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {error?.message || "Failed to fetch latest orders"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const hasOrders = orders.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBagIcon className="w-5 h-5 text-indigo-600" />
              Latest Orders
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Most recent orders in your store
              {data?.totalOrders && ` • ${data.totalOrders} total`}
            </p>
          </div>
          {data?.totalOrders > 5 && (
            <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
              Page {data.currentPage} of {data.totalPages}
            </div>
          )}
        </div>
      </div>

      {/* Orders List */}
      <div className="divide-y divide-gray-100">
        {hasOrders ? (
          orders.map((order) => (
            <div
              key={order._id}
              className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    {/* Order Icon */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                      <ShoppingBagIcon className="w-4 h-4 text-indigo-600" />
                    </div>

                    {/* Order ID */}
                    <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-800">
                      #{order._id?.toString().slice(-6).toUpperCase() || "N/A"}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium capitalize border ${getStatusColor(
                        order.status || "processing"
                      )}`}
                    >
                      {getStatusIcon(order.status || "processing")}
                      <span className="ml-1">
                        {order.status || "processing"}
                      </span>
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center text-sm text-gray-600 mt-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center mr-2">
                      <UserIcon className="w-3 h-3 text-blue-600" />
                    </div>
                    <span className="truncate" title={getUserName(order.user)}>
                      {getUserName(order.user)}
                    </span>
                  </div>

                  {/* Items Preview */}
                  <div className="text-xs text-gray-500 mt-1">
                    {getOrderItemsPreview(order.orderitems)}
                    {order.totalItems > 2 && (
                      <span className="ml-1">+{order.totalItems - 2} more</span>
                    )}
                  </div>
                </div>

                {/* Price & Date */}
                <div className="flex flex-col items-end space-y-2 text-right ml-4">
                  <div className="flex items-center text-sm font-semibold text-gray-900">
                    <CurrencyRupeeIcon className="w-4 h-4 mr-1 text-gray-600" />
                    {order.total ? order.total.toFixed(2) : "0.00"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.formattedDate ||
                      new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBagIcon className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No orders yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by fulfilling your first order.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {data?.totalOrders > 5 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Showing {data.count} of {data.totalOrders} recent orders
            </span>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">
              View All Orders →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
