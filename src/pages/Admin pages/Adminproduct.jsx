// src/pages/Admin/AdminProducts.jsx
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  searchProducts,
  deleteproduct,
} from "../../compopnents/services/API/productapi"; 
import { UpdateProduct } from "../../compopnents/Admin/updateproduct";
import { CreateProduct } from "../../compopnents/Admin/Createproduct";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

export const AdminProducts = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const queryClient = useQueryClient();

  // ✅ Fetch products using React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", search, currentPage, perPage],
    queryFn: () =>
      searchProducts({
        search,
        page: currentPage,
        limit: perPage,
      }),
    keepPreviousData: true,
  });

  const products = data?.data || [];
  const totalRows = data?.totalProducts || 0;

  // ✅ Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteproduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (id) => {
    setSelectedProductId(id);
    setEditModalOpen(true);
  };

  const handleCreate = () => {
    queryClient.invalidateQueries(["products"]);
    setCreateModalOpen(false);
  };

  const handleUpdate = () => {
    queryClient.invalidateQueries(["products"]);
    setEditModalOpen(false);
    setSelectedProductId(null);
  };

  // ✅ Table columns — with icons!
  const columns = [
    {
      name: "Image",
      selector: (row) => row.images?.[0],
      cell: (row) => (
        <img
          src={
            row.images?.[0] || "https://via.placeholder.com/64x64?text=No+Image"
          }
          alt={row.name}
          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
        />
      ),
      width: "80px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      grow: 2,
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
      cell: (row) => `$${row.price?.toFixed(2)}`,
      width: "100px",
    },
    {
      name: "Stock",
      selector: (row) => row.stock,
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.stock > 0
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.stock}
        </span>
      ),
      width: "80px",
    },
    {
      name: "Categories",
      selector: (row) => row.categories || "N/A",
      grow: 1.5,
    },
    {
      name: "Brand",
      selector: (row) => row.brand || "N/A",
      width: "100px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row._id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            title="Edit Product"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Delete Product"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "100px",
    },
  ];

  // Custom styles to match AdminUsers
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Manage Products
          </h1>
          <p className="text-gray-600 mt-1">
            Search, edit, or delete products.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, category, or brand..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-1/2 px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Add Product Button */}
        <div className="mb-6">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Add Product
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <DataTable
            columns={columns}
            data={products}
            progressPending={isLoading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationPerPage={perPage}
            paginationRowsPerPageOptions={[10, 20, 30]}
            onChangeRowsPerPage={(newPerPage, page) => {
              setPerPage(newPerPage);
              setCurrentPage(page);
            }}
            onChangePage={(page) => setCurrentPage(page)}
            highlightOnHover
            pointerOnHover
            customStyles={customStyles}
            noDataComponent={
              <div className="p-8 text-center text-gray-500">
                No products found.
              </div>
            }
          />
        </div>
      </div>

      {/* Modals */}
      <CreateProduct
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreate}
      />
      <UpdateProduct
        productId={selectedProductId}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdate={handleUpdate}
      />
    </div>
  );
};
