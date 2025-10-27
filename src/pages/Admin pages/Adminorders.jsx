// src/components/Admin/AdminOrders.jsx
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import {
  GetAllOrdersAPI,
  UpdateOrderStatusAPI,
} from "../../compopnents/services/API/orderapi";
import {
  PencilIcon,
  ShoppingBagIcon,
  UserIcon,
  CurrencyRupeeIcon,
  ClockIcon,
  ArrowPathIcon,
  XMarkIcon,
  CheckCircleIcon,
  TruckIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

// Enhanced custom styles for modern look
const customStyles = {
  tableWrapper: {
    style: {
      borderRadius: "1.5rem",
      overflow: "hidden",
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
    },
  },
  head: {
    style: {
      backgroundColor: "#f9fafb",
      fontWeight: "700",
      color: "#1f2937",
      fontSize: "0.875rem",
      textTransform: "uppercase",
      letterSpacing: "0.025em",
      borderBottom: "2px solid #e5e7eb",
    },
  },
  headRow: {
    style: {
      minHeight: "56px",
    },
  },
  rows: {
    style: {
      fontSize: "0.95rem",
      color: "#374151",
      minHeight: "60px",
      "&:not(:last-of-type)": {
        borderBottom: "1px solid #f3f4f6",
      },
    },
    highlightOnHoverStyle: {
      backgroundColor: "#f9fafb",
      cursor: "pointer",
      transform: "translateY(-1px)",
      transition: "all 0.2s ease-in-out",
    },
  },
  pagination: {
    style: {
      padding: "1.25rem",
      backgroundColor: "#ffffff",
      borderTop: "1px solid #e5e7eb",
      display: "flex",
      justifyContent: "center",
    },
    pageButtonsStyle: {
      borderRadius: "0.5rem",
      height: "2.5rem",
      width: "2.5rem",
      padding: "0",
      margin: "0 0.25rem",
      backgroundColor: "transparent",
      border: "1px solid #d1d5db",
      color: "#4b5563",
      "&:hover:not(:disabled)": {
        backgroundColor: "#f3f4f6",
        borderColor: "#9ca3af",
      },
      "&:focus": {
        outline: "none",
        backgroundColor: "#e5e7eb",
      },
      "&:disabled": {
        color: "#9ca3af",
      },
    },
  },
};

export const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const {
    data: ordersResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => GetAllOrdersAPI(),
    select: (data) => data.data || [],
    staleTime: 2 * 60 * 1000,
    retry: 2,
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || "Failed to load orders";
      toast.error(`❌ ${errorMessage}`, {
        duration: 4000,
        icon: "❌",
      });
    },
  });

  const orders = ordersResponse || [];

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ orderId, newStatus }) =>
      UpdateOrderStatusAPI(orderId, newStatus),
    onSuccess: async (data, variables) => {
      const { orderId, newStatus } = variables;

      await queryClient.invalidateQueries({ queryKey: ["orders"] });

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }

      toast.success(`✅ Order status updated to "${newStatus}" successfully!`, {
        duration: 3000,
        icon: "🔄",
      });
    },
    onError: (err) => {
      console.error("Error updating status:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to update status";
      toast.error(`❌ ${errorMessage}`, {
        duration: 5000,
        icon: "❌",
      });
    },
  });

  const getUserName = (order) =>
    `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim() ||
    "N/A";

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "processing":
        return <ClockIcon className="w-4 h-4" />;
      case "shipped":
        return <TruckIcon className="w-4 h-4" />;
      case "delivered":
        return <CheckBadgeIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  // ✅ FIXED COLUMNS WITH PROPER SPACING AND NO OVERFLOW
  const columns = useMemo(
    () => [
      {
        name: "ORDER ID",
        selector: (row) => row._id,
        sortable: true,
        grow: 1.5,
        cell: (row) => (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
              <ShoppingBagIcon className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-xs font-medium text-gray-900 truncate max-w-[100px]">
              #{row._id?.toString().slice(-6).toUpperCase() || "N/A"}
            </div>
          </div>
        ),
      },
      {
        name: "CUSTOMER",
        selector: (row) => getUserName(row),
        sortable: true,
        grow: 2.5,
        cell: (row) => (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                {getUserName(row)}
              </div>
              <div className="text-xs text-gray-500 truncate max-w-[150px]">
                {row.user?.email || "N/A"}
              </div>
            </div>
          </div>
        ),
      },
      {
        name: "TOTAL",
        selector: (row) => row.total,
        sortable: true,
        right: true,
        grow: 1.5,
        cell: (row) => (
          <div className="flex items-center justify-end space-x-1">
            <CurrencyRupeeIcon className="w-4 h-4 text-gray-600" />
            <div className="text-sm font-semibold text-gray-900">
              {row.total}
            </div>
          </div>
        ),
      },
      {
        name: "STATUS",
        selector: (row) => row.status,
        sortable: true,
        center: true,
        grow: 1.5,
        cell: (row) => (
          <span
            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(
              row.status
            )}`}
          >
            {getStatusIcon(row.status)}
            <span className="ml-1 capitalize">{row.status}</span>
          </span>
        ),
      },
      {
        name: "DATE",
        selector: (row) => new Date(row.createdAt).toLocaleDateString(),
        sortable: true,
        center: true,
        grow: 1.5,
        cell: (row) => (
          <div className="text-sm text-gray-600">
            {new Date(row.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        ),
      },
      {
        name: "ACTIONS",
        cell: (row) => (
          <div className="flex gap-2 justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedOrder(row);
              }}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 hover:shadow-md"
              title="View Details"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        center: true,
        grow: 1,
      },
    ],
    []
  );

  if (isLoading) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Manage Orders
            </h1>
            <p className="text-gray-600 mt-1">Loading your orders...</p>
          </div>
          <div className="flex justify-center items-center py-32">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
            <span className="ml-4 text-gray-600 text-lg">
              Loading orders...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <ExclamationCircleIcon className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Error loading orders
            </h3>
            <p className="text-gray-600 mb-6">{error.message}</p>
            <button
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["orders"] })
              }
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:shadow-lg flex items-center gap-2 mx-auto"
            >
              <ArrowPathIcon className="w-5 h-5" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Manage Orders
              </h1>
              <p className="text-gray-600 mt-1">
                {orders.length > 0
                  ? `${orders.length} orders`
                  : "No orders found"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        {orders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.length}
                </p>
              </div>
              <ShoppingBagIcon className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Processing</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {orders.filter((o) => o.status === "processing").length}
                </p>
              </div>
              <ClockIcon className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Shipped</p>
                <p className="text-2xl font-bold text-blue-600">
                  {orders.filter((o) => o.status === "shipped").length}
                </p>
              </div>
              <TruckIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter((o) => o.status === "delivered").length}
                </p>
              </div>
              <CheckBadgeIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <DataTable
            columns={columns}
            data={orders}
            progressPending={isLoading}
            highlightOnHover
            pointerOnHover
            onRowClicked={(row) => setSelectedOrder(row)}
            customStyles={customStyles}
            noDataComponent={
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingBagIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No orders found
                </h3>
                <p className="text-gray-500">
                  Orders will appear here once customers place them.
                </p>
              </div>
            }
          />
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Order Details
                </h2>
                <p className="text-sm text-gray-600">
                  Order ID: #
                  {selectedOrder._id?.toString().slice(-6).toUpperCase() ||
                    "N/A"}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-200"
                aria-label="Close"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Loading State */}
            {updateOrderStatusMutation.isPending && (
              <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  <p className="text-sm font-medium text-blue-800">
                    Updating order status...
                  </p>
                </div>
              </div>
            )}

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                  <div className="text-sm font-medium text-blue-800 mb-1">
                    Customer
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {getUserName(selectedOrder)}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    {selectedOrder.user?.email || "N/A"}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <div className="text-sm font-medium text-green-800 mb-1">
                    Total Amount
                  </div>
                  <div className="text-lg font-bold text-gray-900 flex items-center">
                    <CurrencyRupeeIcon className="w-5 h-5 mr-1" />
                    {selectedOrder.total}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                  <div className="text-sm font-medium text-purple-800 mb-1">
                    Order Date
                  </div>
                  <div className="text-sm text-gray-900">
                    {new Date(selectedOrder.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                  <div className="text-sm font-medium text-amber-800 mb-1">
                    Items Count
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {selectedOrder.orderitems?.length || 0}
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-2">
                      Order Status
                    </div>
                    <span
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl border ${getStatusBadgeClass(
                        selectedOrder.status
                      )}`}
                    >
                      {getStatusIcon(selectedOrder.status)}
                      <span className="ml-2 capitalize font-semibold">
                        {selectedOrder.status}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <select
                      value={selectedOrder.status}
                      onChange={(e) =>
                        updateOrderStatusMutation.mutate({
                          orderId: selectedOrder._id,
                          newStatus: e.target.value,
                        })
                      }
                      disabled={updateOrderStatusMutation.isPending}
                      className="px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-medium bg-white disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Shipping Details */}
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TruckIcon className="w-5 h-5 text-indigo-600" />
                    Shipping Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Full Name:
                      </span>
                      <span className="text-sm text-gray-900 font-medium">
                        {selectedOrder.shippingdetails?.firstName || ""}{" "}
                        {selectedOrder.shippingdetails?.lastName || ""}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Phone:
                      </span>
                      <span className="text-sm text-gray-900 font-medium">
                        {selectedOrder.shippingdetails?.phoneNumber || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        City:
                      </span>
                      <span className="text-sm text-gray-900 font-medium">
                        {selectedOrder.shippingdetails?.city || "N/A"}
                      </span>
                    </div>
                    {selectedOrder.shippingdetails?.address && (
                      <div className="pt-3 border-t border-gray-200">
                        <div className="text-sm font-medium text-gray-500 mb-2">
                          Full Address:
                        </div>
                        <div className="text-sm text-gray-900 space-y-1">
                          <div>
                            {selectedOrder.shippingdetails.address.street || ""}
                          </div>
                          <div>
                            {selectedOrder.shippingdetails.address.state || ""},{" "}
                            {selectedOrder.shippingdetails.address.pincode ||
                              ""}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ShoppingBagIcon className="w-5 h-5 text-green-600" />
                    Order Items ({selectedOrder.orderitems?.length || 0})
                  </h3>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {selectedOrder.orderitems?.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Qty: {item.quantity} • ₹{item.price} each
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!selectedOrder.orderitems ||
                      selectedOrder.orderitems.length === 0) && (
                      <div className="text-center py-4 text-gray-500">
                        No items in this order
                      </div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="pt-4 border-t border-gray-200 space-y-2 mt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">
                        Subtotal:
                      </span>
                      <span className="font-semibold">
                        ₹{selectedOrder.subtotal || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">
                        Shipping:
                      </span>
                      <span className="font-semibold">
                        ₹{selectedOrder.shippingcharges || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                      <span>Total:</span>
                      <span>₹{selectedOrder.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-gray-200 bg-white">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  disabled={updateOrderStatusMutation.isPending}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
