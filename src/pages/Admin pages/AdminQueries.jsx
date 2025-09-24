// src/components/Admin/AdminQueries.jsx
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRequests,
  getRequest,
  replyRequest,
} from "../../compopnents/services/API/contactapi"; // ⚠️ Fixed typo
import { XMarkIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

export const AdminQueries = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const queryClient = useQueryClient();

  // ✅ Fetch all contact requests
  const { data, isLoading, isError } = useQuery({
    queryKey: ["contactRequests", currentPage, perPage],
    queryFn: () =>
      getRequests({
        page: currentPage,
        limit: perPage,
      }),
    keepPreviousData: true,
  });

  const requests = data?.data || [];
  const totalRows = data?.totalRequests || 0;

  // ✅ Fetch single request (when viewing details)
  const { data: selectedRequest, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["contactRequest", selectedRequestId],
    queryFn: () => getRequest(selectedRequestId),
    enabled: !!selectedRequestId && viewModalOpen,
    select: (res) => res?.data,
  });

  // ✅ Reply mutation
  const replyMutation = useMutation({
    mutationFn: (replyMessage) =>
      replyRequest(selectedRequestId, { replymessage: replyMessage }),
    onSuccess: () => {
      toast.success("✅ Reply sent successfully!");
      queryClient.invalidateQueries(["contactRequests"]);
      queryClient.invalidateQueries(["contactRequest", selectedRequestId]);
      setReplyModalOpen(false);
      setSelectedRequestId(null);
    },
    onError: (err) => {
      toast.error(
        `❌ ${err.response?.data?.message || "Failed to send reply"}`
      );
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
  };

  // ✅ Table columns — with icons!
  const columns = [
    { name: "Name", selector: (row) => row.name || "Guest", sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    {
      name: "Subject",
      selector: (row) => row.subject || "N/A",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === "resolved"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.status}
        </span>
      ),
      width: "120px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleView(row._id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="View Details"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
          {row.status === "pending" && (
            <button
              onClick={() => handleReply(row._id)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
              title="Reply"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </button>
          )}
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "100px",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Manage Queries
          </h1>
          <p className="text-gray-600 mt-1">
            View and reply to user inquiries.
          </p>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <DataTable
            columns={columns}
            data={requests}
            progressPending={isLoading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationPerPage={perPage}
            onChangeRowsPerPage={(newPerPage) => setPerPage(newPerPage)}
            onChangePage={(page) => setCurrentPage(page)}
            noDataComponent={
              <div className="p-8 text-center text-gray-500">
                No contact requests found.
              </div>
            }
            highlightOnHover
            pointerOnHover
          />
        </div>
      </div>

      {/* ✅ View Modal — Upgraded Design */}
      {viewModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                Request Details
              </h2>
              <button
                onClick={handleCloseView}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
                aria-label="Close"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isLoadingDetails ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : selectedRequest ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-sm font-medium text-gray-500">
                      Name
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {selectedRequest.name}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-sm font-medium text-gray-500">
                      Email
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {selectedRequest.email}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-sm font-medium text-gray-500">
                      Subject
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {selectedRequest.subject}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-sm font-medium text-gray-500">
                      Message
                    </div>
                    <div className="text-sm text-gray-900 whitespace-pre-line">
                      {selectedRequest.message}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-sm font-medium text-gray-500">
                      Status
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {selectedRequest.status}
                    </div>
                  </div>
                  {selectedRequest.replyMessage && (
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="text-sm font-medium text-blue-800">
                        Reply
                      </div>
                      <div className="text-sm text-blue-900 whitespace-pre-line">
                        {selectedRequest.replyMessage}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No details found
                </p>
              )}
            </div>

            {/* Compact Right-Aligned Button */}
            <div className="px-6 py-5 border-t border-gray-100 bg-white">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseView}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Reply Modal — Upgraded Design */}
      {replyModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Send Reply</h2>
              <button
                onClick={handleCloseReply}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
                aria-label="Close"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const replyMessage = formData.get("replymessage").trim();
                  if (!replyMessage) {
                    toast.error("⚠️ Please enter a reply message");
                    return;
                  }
                  replyMutation.mutate(replyMessage);
                }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Your Reply *
                  </label>
                  <textarea
                    name="replymessage"
                    rows={6}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 hover:border-gray-300 focus:border-indigo-500 transition"
                    placeholder="Type your reply here..."
                    required
                    disabled={replyMutation.isPending}
                  />
                </div>

                {/* Compact Right-Aligned Buttons */}
                <div className="flex justify-end gap-3 pt-2 mt-4 border-t border-gray-100 -mx-6 px-6 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseReply}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={replyMutation.isPending}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-lg flex items-center gap-1.5 transition
                      ${
                        replyMutation.isPending
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                  >
                    {replyMutation.isPending ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending
                      </>
                    ) : (
                      "Send Reply"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
