// src/components/Admin/AdminQueries.jsx
import React, { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRequests,
  getRequest,
  replyRequest,
} from "../../compopnents/services/API/contactapi";
import {
  XMarkIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

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

export const AdminQueries = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  const queryClient = useQueryClient();

  // ✅ Fetch all contact requests
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["contactRequests", currentPage, perPage],
    queryFn: () =>
      getRequests({
        page: currentPage,
        limit: perPage,
      }),
    keepPreviousData: true,
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || "Failed to load queries";
      toast.error(`❌ ${errorMessage}`, {
        duration: 4000,
        icon: "❌",
      });
    },
  });

  const requests = data?.data || [];
  const totalRows = data?.totalRequests || 0;

  // ✅ Fetch single request (when viewing details)
  const { data: selectedRequest, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["contactRequest", selectedRequestId],
    queryFn: () => getRequest(selectedRequestId),
    enabled: !!selectedRequestId && (viewModalOpen || replyModalOpen),
    select: (res) => res?.data,
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || "Failed to load request details";
      toast.error(`❌ ${errorMessage}`, {
        duration: 4000,
        icon: "❌",
      });
    },
  });

  // ✅ Reply mutation
  const replyMutation = useMutation({
    mutationFn: (replyMessage) =>
      replyRequest(selectedRequestId, { replymessage: replyMessage }),
    onSuccess: () => {
      toast.success("✅ Reply sent successfully! 📧", {
        duration: 3000,
        icon: "✅",
      });
      queryClient.invalidateQueries(["contactRequests"]);
      queryClient.invalidateQueries(["contactRequest", selectedRequestId]);
      setReplyModalOpen(false);
      setSelectedRequestId(null);
      setReplyMessage("");
    },
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || "Failed to send reply";
      toast.error(`❌ ${errorMessage}`, {
        duration: 5000,
        icon: "❌",
      });
    },
  });

  // Handlers
  const handleView = (id) => {
    setSelectedRequestId(id);
    setViewModalOpen(true);
  };

  const handleReply = (id) => {
    setSelectedRequestId(id);
    setReplyModalOpen(true);
  };

  const handleCloseView = () => {
    setViewModalOpen(false);
    setSelectedRequestId(null);
  };

  const handleCloseReply = () => {
    setReplyModalOpen(false);
    setSelectedRequestId(null);
    setReplyMessage("");
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) {
      toast.error("⚠️ Please enter a reply message", {
        duration: 3000,
        icon: "⚠️",
      });
      return;
    }
    replyMutation.mutate(replyMessage.trim());
  };

  // ✅ Enhanced table columns with modern styling
  const columns = useMemo(
    () => [
      {
        name: "SENDER",
        selector: (row) => row.name || "Guest",
        sortable: true,
        cell: (row) => (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {row.name || "Guest"}
              </div>
              <div className="text-sm text-gray-500 truncate max-w-xs">
                {row.email}
              </div>
            </div>
          </div>
        ),
        grow: 2,
      },
      {
        name: "SUBJECT",
        selector: (row) => row.subject || "N/A",
        sortable: true,
        cell: (row) => (
          <div className="text-sm font-medium text-gray-900">
            {row.subject || "No subject"}
          </div>
        ),
        grow: 2,
      },
      {
        name: "STATUS",
        selector: (row) => row.status,
        cell: (row) => (
          <span
            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${
              row.status === "resolved"
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-yellow-100 text-yellow-800 border-yellow-200"
            }`}
          >
            {row.status === "resolved" ? (
              <CheckCircleIcon className="w-3 h-3 mr-1" />
            ) : (
              <ExclamationCircleIcon className="w-3 h-3 mr-1" />
            )}
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
        ),
        center: true,
        width: "120px",
      },
      {
        name: "ACTIONS",
        cell: (row) => (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => handleView(row._id)}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 hover:shadow-md"
              title="View Details"
            >
              <EyeIcon className="w-5 h-5" />
            </button>
            {row.status === "pending" && (
              <button
                onClick={() => handleReply(row._id)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:shadow-md"
                title="Reply"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        center: true,
        width: "100px",
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
              Manage Queries
            </h1>
            <p className="text-gray-600 mt-1">Loading user inquiries...</p>
          </div>
          <div className="flex justify-center items-center py-32">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
            <span className="ml-4 text-gray-600 text-lg">
              Loading queries...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <ExclamationCircleIcon className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Error loading queries
            </h3>
            <p className="text-gray-600 mb-6">{error.message}</p>
            <button
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["contactRequests"] })
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
                Manage Queries
              </h1>
              {/* <p className="text-gray-600 mt-1">
                {totalRows > 0
                  ? `${totalRows} inquiries`
                  : "No inquiries found"}
              </p> */}
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        {totalRows > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Queries
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalRows}
                  </p>
                </div>
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {requests.filter((r) => r.status === "pending").length}
                  </p>
                </div>
                <ExclamationCircleIcon className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {requests.filter((r) => r.status === "resolved").length}
                  </p>
                </div>
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <DataTable
            columns={columns}
            data={requests}
            progressPending={isLoading}
            progressComponent={
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Loading queries...</p>
              </div>
            }
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationPerPage={perPage}
            onChangeRowsPerPage={(newPerPage) => setPerPage(newPerPage)}
            onChangePage={(page) => setCurrentPage(page)}
            noDataComponent={
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No contact requests found
                </h3>
                <p className="text-gray-500">
                  Users will be able to send inquiries through your contact
                  form.
                </p>
              </div>
            }
            highlightOnHover
            pointerOnHover
            customStyles={customStyles}
          />
        </div>
      </div>

      {/* ✅ View Modal — Modern Design */}
      {viewModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Request Details
                </h2>
                <p className="text-sm text-gray-600">
                  {selectedRequest?.subject || "No subject"}
                </p>
              </div>
              <button
                onClick={handleCloseView}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-200"
                aria-label="Close"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isLoadingDetails ? (
                <div className="flex justify-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                </div>
              ) : selectedRequest ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                      <div className="text-sm font-medium text-blue-800 mb-1">
                        Name
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {selectedRequest.name || "Guest"}
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                      <div className="text-sm font-medium text-green-800 mb-1">
                        Email
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {selectedRequest.email}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                    <div className="text-sm font-medium text-purple-800 mb-1">
                      Subject
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {selectedRequest.subject || "No subject"}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200">
                    <div className="text-sm font-medium text-gray-800 mb-2">
                      Message
                    </div>
                    <div className="text-sm text-gray-900 whitespace-pre-line bg-white p-3 rounded-lg border border-gray-200">
                      {selectedRequest.message}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                    <div className="text-sm font-medium text-amber-800 mb-1">
                      Status
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {selectedRequest.status}
                    </div>
                  </div>

                  {selectedRequest.replyMessage && (
                    <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-4 rounded-xl border border-cyan-200">
                      <div className="text-sm font-medium text-cyan-800 mb-2">
                        Reply
                      </div>
                      <div className="text-sm text-cyan-900 whitespace-pre-line bg-white p-3 rounded-lg border border-cyan-200">
                        {selectedRequest.replyMessage}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <ExclamationCircleIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No details found</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-gray-200 bg-white">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseView}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Reply Modal — Modern Design */}
      {replyModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Send Reply</h2>
                <p className="text-sm text-gray-600">
                  Replying to: {selectedRequest?.name || "User"}
                </p>
              </div>
              <button
                onClick={handleCloseReply}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-200"
                aria-label="Close"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isLoadingDetails ? (
                <div className="flex justify-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-600 border-t-transparent"></div>
                </div>
              ) : (
                <form onSubmit={handleReplySubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-500" />
                      Your Reply *
                    </label>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="Type your reply here..."
                      required
                      disabled={replyMutation.isPending}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCloseReply}
                      disabled={replyMutation.isPending}
                      className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={replyMutation.isPending || !replyMessage.trim()}
                      className={`px-5 py-2.5 text-sm font-medium text-white rounded-xl flex items-center gap-2 transition-all duration-200 hover:shadow-lg
                        ${
                          replyMutation.isPending || !replyMessage.trim()
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        }`}
                    >
                      {replyMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <ChatBubbleLeftRightIcon className="w-4 h-4" />
                          Send Reply
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
