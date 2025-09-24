// src/components/Admin/AdminOrders.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import {
  GetAllOrdersAPI,
  UpdateOrderStatusAPI,
} from "../../compopnents/services/API/orderapi";
import { PencilIcon } from "@heroicons/react/24/solid";

// Reuse the same styles from AdminUsers
const customStyles = {
  tableWrapper: {
    style: {
      borderRadius: "1rem",
      overflow: "hidden",
      boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
    },
  },
  headRow: {
    style: {
      backgroundColor: "#f8fafc",
      fontWeight: "600",
      color: "#334155",
      fontSize: "0.875rem",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
  },
  rows: {
    style: {
      fontSize: "0.875rem",
      color: "#1e293b",
      "&:not(:last-of-type)": {
        borderBottom: "1px solid #e2e8f0",
      },
    },
    highlightOnHoverStyle: {
      backgroundColor: "#f1f5f9",
      cursor: "pointer",
    },
  },
  pagination: {
    style: {
      padding: "1rem",
      backgroundColor: "#f8fafc",
      borderTop: "1px solid #e2e8f0",
    },
  },
};

export const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState(""); // Optional: for future search
  const queryClient = useQueryClient();

  // Fetch orders
  const {
    data: ordersResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => GetAllOrdersAPI(),
    select: (data) => data.data.data || [],
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });

  const orders = ordersResponse || [];

  // Mutation for updating status
  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ orderId, newStatus }) =>
      UpdateOrderStatusAPI(orderId, newStatus),
    onSuccess: (data, variables) => {
      const { orderId, newStatus } = variables;
      queryClient.setQueryData(["orders"], (oldOrders) => {
        if (!oldOrders) return oldOrders;
        return oldOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        );
      });
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      toast.success("✅ Status updated successfully!");
    },
    onError: (err) => {
      console.error("Error updating status:", err);
      toast.error("❌ Failed to update status. Please try again.");
    },
  });

  // Helper: Get user name
  const getUserName = (order) =>
    `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim() ||
    "N/A";

  // Helper: Status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Columns for DataTable
  const columns = [
    {
      name: "Order ID",
      selector: (row) => row._id,
      sortable: true,
      grow: 2,
      wrap: true,
      cell: (row) => (
        <div className="text-xs font-medium text-gray-900 truncate max-w-xs">
          {row._id}
        </div>
      ),
    },
    {
      name: "User",
      selector: (row) => getUserName(row),
      sortable: true,
      cell: (row) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {getUserName(row)}
          </div>
          <div className="text-sm text-gray-500">
            {row.user?.email || "N/A"}
          </div>
        </div>
      ),
    },
    {
      name: "Total",
      selector: (row) => row.total,
      sortable: true,
      right: true,
      cell: (row) => (
        <div className="text-lg font-semibold text-gray-900">${row.total}</div>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      center: true,
      cell: (row) => (
        <span
          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
            row.status
          )}`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Date",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
      center: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOrder(row);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
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
    },
  ];

  // Loading state (optional: you can remove if you prefer skeleton in table)
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-4 text-gray-600 text-lg">
              Loading orders...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <svg
              className="mx-auto h-16 w-16 text-red-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.034 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Error loading orders
            </h3>
            <p className="text-gray-600 mb-6">{error.message}</p>
            <button
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["orders"] })
              }
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Manage Orders
          </h1>
          <p className="text-gray-600 mt-1">
            {orders.length > 0 ? `${orders.length} orders` : "No orders found"}
          </p>
        </div>

        {/* Optional Search Bar (uncomment if needed later) */}
        {/* <div className="mb-6">
          <input
            type="text"
            placeholder="Search by user or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          />
        </div> */}

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <DataTable
            columns={columns}
            data={orders}
            progressPending={isLoading}
            highlightOnHover
            pointerOnHover
            onRowClicked={(row) => setSelectedOrder(row)}
            customStyles={customStyles}
            noDataComponent={
              <div className="p-8 text-center text-gray-500">
                No orders found.
              </div>
            }
            // If you add server-side pagination later:
            // pagination
            // paginationServer
            // paginationTotalRows={totalRows}
            // onChangePage={setPage}
            // onChangeRowsPerPage={setPerPage}
          />
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Order Details
                </h2>
                <p className="text-sm text-gray-500">
                  Order ID: {selectedOrder._id}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
                aria-label="Close"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {updateOrderStatusMutation.isPending && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <p className="text-sm font-medium text-blue-800">
                      Updating status...
                    </p>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm font-medium text-gray-500">
                    User Email
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {selectedOrder.user?.email || "N/A"}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm font-medium text-gray-500">
                    User Name
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {getUserName(selectedOrder)}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm font-medium text-gray-500">Total</div>
                  <div className="text-lg font-bold text-gray-900">
                    ${selectedOrder.total}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm font-medium text-gray-500">
                    Order Date
                  </div>
                  <div className="text-sm text-gray-900">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      Order Status
                    </div>
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status}
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
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                    {updateOrderStatusMutation.isPending && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Shipping Details */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Shipping Details
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Name:
                      </span>
                      <span className="text-sm text-gray-900">
                        {selectedOrder.shippingdetails?.firstName || ""}{" "}
                        {selectedOrder.shippingdetails?.lastName || ""}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Phone:
                      </span>
                      <span className="text-sm text-gray-900">
                        {selectedOrder.shippingdetails?.phoneNumber || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        City:
                      </span>
                      <span className="text-sm text-gray-900">
                        {selectedOrder.shippingdetails?.city || "N/A"}
                      </span>
                    </div>
                    {selectedOrder.shippingdetails?.address && (
                      <>
                        <div className="pt-2 border-t border-gray-200">
                          <div className="text-sm font-medium text-gray-500 mb-1">
                            Address:
                          </div>
                          <div className="text-sm text-gray-900">
                            {selectedOrder.shippingdetails.address.street || ""}
                          </div>
                          <div className="text-sm text-gray-900">
                            {selectedOrder.shippingdetails.address.state || ""},{" "}
                            {selectedOrder.shippingdetails.address.pincode ||
                              ""}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Order Items
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                    {selectedOrder.orderitems?.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-start py-3 border-b border-gray-200 last:border-b-0"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            ${item.price}
                          </div>
                          <div className="text-xs text-gray-500">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal:</span>
                        <span className="font-medium">
                          ${selectedOrder.subtotal || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Shipping:</span>
                        <span className="font-medium">
                          ${selectedOrder.shippingcharges || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                        <span>Total:</span>
                        <span>${selectedOrder.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-gray-100 bg-white">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  disabled={updateOrderStatusMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
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
