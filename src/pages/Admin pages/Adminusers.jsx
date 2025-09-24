// src/pages/Admin/AdminUsers.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import {
  adminSearchUsers,
  adminDeleteUser,
} from "../../compopnents/services/API/userapi";
import { EditUserModal } from "../../compopnents/Admin/Manageuser";
import { UserDetailsModal } from "../../compopnents/Admin/UserDetailsModal";
import toast from "react-hot-toast";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

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

export const AdminUsers = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsUser, setDetailsUser] = useState(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["users", page, perPage, search],
    queryFn: () => adminSearchUsers({ page, limit: perPage, search }),
    keepPreviousData: true,
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || "Failed to load users";
      toast.error(errorMessage);
    },
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await adminDeleteUser(id);
        toast.success("User deleted successfully 🗑️");
        refetch();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const columns = [
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      grow: 2,
      wrap: true,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
      center: true,
    },
    {
      name: "Verified",
      selector: (row) => (row.isVerified ? "✅ Yes" : "❌ No"),
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
              setSelectedUser(row);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            title="Edit User"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row._id);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
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
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Manage Users
          </h1>
          <p className="text-gray-600 mt-1">
            Search, edit, or delete user accounts.
          </p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-1/2 px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <DataTable
            columns={columns}
            data={data?.users || []}
            progressPending={isLoading}
            pagination
            paginationServer
            paginationTotalRows={data?.totalUsers || 0}
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
              <div className="p-8 text-center text-gray-500">
                No users found.
              </div>
            }
          />
        </div>
      </div>

      <EditUserModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
      />
      <UserDetailsModal
        isOpen={!!detailsUser}
        onClose={() => setDetailsUser(null)}
        user={detailsUser}
      />
    </div>
  );
};
