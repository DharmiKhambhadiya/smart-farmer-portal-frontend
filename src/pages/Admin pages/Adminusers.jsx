import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import {
  adminSearchUsers,
  adminDeleteUser,
} from "../../compopnents/services/API/userapi";
import { EditUserModal } from "../../compopnents/Admin/Manageuser";
import { UserDetailsModal } from "../../compopnents/Admin/UserDetailsModal";
import toast from "react-hot-toast";
import {
  PencilIcon,
  TrashIcon,
  UserIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { DeleteConfirmModal } from "../../compopnents/Admin/Deleteconfirmation";

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

export const AdminUsers = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsUser, setDetailsUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null); // State for user to delete

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["users", page, perPage, search],
    queryFn: () => adminSearchUsers({ page, limit: perPage, search }),
    keepPreviousData: true,
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || "Failed to load users";
      toast.error(`❌ ${errorMessage}`, {
        duration: 4000,
        icon: "❌",
      });
    },
  });

  const handleDeleteInitiate = (id, email) => {
    // Show toast when delete button is clicked
    toast("🗑️ Initiating user deletion...", {
      duration: 2000,
      icon: "🗑️",
    });
    // Open confirmation modal
    setDeleteUser({ id, email });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteUser) return;

    const { id, email } = deleteUser;
    try {
      const loadingToast = toast.loading("Deleting user...");
      await adminDeleteUser(id);
      toast.success(`✅ User "${email}" deleted successfully!`, {
        duration: 3000,
        icon: "🗑️",
      });
      refetch();
    } catch (err) {
      toast.error(
        `❌ Failed to delete user: ${
          err.response?.data?.message || "Unknown error"
        }`,
        {
          duration: 5000,
          icon: "❌",
        }
      );
    } finally {
      toast.dismiss(loadingToast); // Dismiss loading toast
      setDeleteUser(null); // Close modal
    }
  };

  const handleDeleteCancel = () => {
    // Show toast when deletion is cancelled
    toast("🛑 Deletion cancelled", {
      duration: 2000,
      icon: "🛑",
    });
    setDeleteUser(null); // Close modal
  };

  // Enhanced columns with better styling
  const columns = useMemo(
    () => [
      {
        name: "User",
        selector: (row) => `${row.firstName || ""} ${row.lastName || ""}`,
        sortable: true,
        grow: 2,
        cell: (row) => (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {row.firstName || row.email.split("@")[0]}
              </div>
              <div className="text-sm text-gray-500 truncate max-w-xs">
                {row.email}
              </div>
            </div>
          </div>
        ),
      },
      {
        name: "Role",
        selector: (row) => row.role,
        sortable: true,
        center: true,
        cell: (row) => (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              row.role === "admin"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {row.role.charAt(0).toUpperCase() + row.role.slice(1)}
          </span>
        ),
      },
      {
        name: "Verified",
        selector: (row) => row.isVerified,
        sortable: true,
        center: true,
        cell: (row) =>
          row.isVerified ? (
            <div className="flex items-center justify-center text-green-600">
              <CheckCircleIcon className="w-5 h-5" />
            </div>
          ) : (
            <div className="flex items-center justify-center text-red-600">
              <XCircleIcon className="w-5 h-5" />
            </div>
          ),
      },
      {
        name: "Actions",
        cell: (row) => (
          <div className="flex gap-2 justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUser(row);
              }}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 hover:shadow-md"
              title="Edit User"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteInitiate(row._id, row.email);
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:shadow-md"
              title="Delete User"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        center: true,
      },
    ],
    []
  );

  const totalUsers = data?.totalUsers || 0;

  // Handle search with toast feedback
  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Manage Users
              </h1>
              <p className="text-gray-600 mt-1">
                {totalUsers} users • Search, edit, or delete user accounts
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <DataTable
            columns={columns}
            data={data?.users || []}
            progressPending={isLoading}
            progressComponent={
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Loading users...</p>
              </div>
            }
            pagination
            paginationServer
            paginationTotalRows={totalUsers}
            paginationPerPage={perPage}
            onChangePage={(page) => setPage(page)}
            onChangeRowsPerPage={(newPerPage, page) => {
              setPerPage(newPerPage);
              setPage(page);
            }}
            highlightOnHover
            pointerOnHover
            onRowClicked={(row) => setDetailsUser(row)}
            customStyles={customStyles}
            noDataComponent={
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {search ? `No users found for "${search}"` : "No users found"}
                </h3>
                <p className="text-gray-500">
                  {search
                    ? "Try adjusting your search terms."
                    : "Users will appear here once they register."}
                </p>
                {search && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                      toast.success("✅ Cleared search filters", {
                        duration: 2000,
                        icon: "🧹",
                      });
                    }}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            }
          />
        </div>
      </div>

      {/* Modals */}
      <EditUserModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
        onSuccess={refetch}
      />
      <UserDetailsModal
        isOpen={!!detailsUser}
        onClose={() => setDetailsUser(null)}
        user={detailsUser}
      />
      <DeleteConfirmModal
        isOpen={!!deleteUser}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={deleteUser?.email || ""}
        itemType="user"
      />
    </div>
  );
};
