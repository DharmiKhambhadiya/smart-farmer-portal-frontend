import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getLatestOrders } from "../services/API/dashboardapi";

export const LatestOrders = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["latest-orders"],
    queryFn: () => getLatestOrders({ limit: 5, page: 1 }),
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "text-green-600 bg-green-100";
      case "shipped":
        return "text-blue-600 bg-blue-100";
      case "processing":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Helper function to safely get user name
  const getUserName = (user) => {
    if (!user) return "Unknown User";

    const { firstName = "", lastName = "" } = user;
    return `${firstName} ${lastName}`.trim() || "Unknown User";
  };

  // Helper function to safely get order items preview
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

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="text-right">
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="mx-auto h-12 w-12 text-red-400 mb-4">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            Error loading orders
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {error?.message || "Failed to fetch latest orders"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Check if data exists and has orders
  const orders = data?.data || [];
  const hasOrders = orders.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Latest Orders
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Most recent orders in your store
              {data?.totalOrders && ` • ${data.totalOrders} total`}
            </p>
          </div>
          {data?.totalOrders > 5 && (
            <div className="text-sm text-gray-500">
              Page {data.currentPage} of {data.totalPages}
            </div>
          )}
        </div>
      </div>

      {/* Orders List */}
      <div className="divide-y divide-gray-200">
        {hasOrders ? (
          orders.map((order) => (
            <div key={order._id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    {/* Order ID Badge */}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      #{order._id?.toString().slice(-6).toUpperCase() || "N/A"}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                        order.status || "processing"
                      )}`}
                    >
                      {order.status || "processing"}
                    </span>
                  </div>

                  {/* Order Items Preview */}
                  {/* <div className="mt-2">
                    <span className="text-sm text-gray-900 font-medium">
                      {getOrderItemsPreview(order.orderitems)}
                    </span>
                    {order.totalItems > 2 && (
                      <span className="ml-2 text-gray-400 text-xs">
                        +{order.totalItems - 2} more
                      </span>
                    )}
                  </div> */}

                  {/* User Info */}
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <svg
                      className="w-4 h-4 mr-1 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="truncate" title={getUserName(order.user)}>
                      {getUserName(order.user)}
                    </span>
                  </div>
                </div>

                {/* Date & Price */}
                <div className="flex flex-col items-end space-y-2 text-right ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    ${order.total ? order.total.toFixed(2) : "0.00"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.formattedDate || new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
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

      {/* Footer with View All */}
      {data?.totalOrders > 5 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Showing {data.count} of {data.totalOrders} recent orders
            </span>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
              View All Orders →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
