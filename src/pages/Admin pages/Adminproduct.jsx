// src/pages/Admin/AdminProducts.jsx
import React, { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  searchProducts,
  deleteproduct,
} from "../../compopnents/services/API/productapi";
import { UpdateProduct } from "../../compopnents/Admin/updateproduct";
import { CreateProduct } from "../../compopnents/Admin/Createproduct";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  PhotoIcon,
  CurrencyDollarIcon,
  ArchiveBoxIcon,
  TagIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { DeleteConfirmModal } from "../../compopnents/Admin/Deleteconfirmation";

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

export const AdminProducts = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", search, currentPage, perPage],
    queryFn: () =>
      searchProducts({
        search,
        page: currentPage,
        limit: perPage,
      }),
    keepPreviousData: true,
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || "Failed to load products";
      toast.error(`❌ ${errorMessage}`, {
        duration: 4000,
        icon: "❌",
      });
    },
  });

  const products = data?.data || [];
  const totalRows = data?.totalProducts || 0;

  const deleteMutation = useMutation({
    mutationFn: deleteproduct,
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previous = queryClient.getQueryData([
        "products",
        search,
        currentPage,
        perPage,
      ]);
      queryClient.setQueryData(
        ["products", search, currentPage, perPage],
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter((product) => product._id !== productId),
            totalProducts: Math.max(0, old.totalProducts - 1),
          };
        }
      );
      return { previous };
    },
    onError: (err, productId, context) => {
      queryClient.setQueryData(
        ["products", search, currentPage, perPage],
        context.previous
      );
      const errorMessage =
        err.response?.data?.message || "Failed to delete product";
      toast.error(`❌ ${errorMessage}`, {
        duration: 5000,
        icon: "❌",
      });
    },
    onSuccess: () => {
      toast.success(
        `✅ Product "${
          deleteProduct?.name || "Unknown"
        }" deleted successfully!`,
        {
          duration: 3000,
          icon: "🗑️",
        }
      );
      setDeleteProduct(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleDeleteInitiate = (product) => {
    toast("🗑️ Initiating product deletion...", {
      duration: 2000,
      icon: "🗑️",
    });
    setDeleteProduct(product);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteProduct) return;
    const loadingToast = toast.loading("Deleting product...");
    try {
      await deleteMutation.mutateAsync(deleteProduct._id);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleDeleteCancel = () => {
    toast("🛑 Deletion cancelled", {
      duration: 2000,
      icon: "🛑",
    });
    setDeleteProduct(null);
  };

  const handleEdit = (id) => {
    setSelectedProductId(id);
    setEditModalOpen(true);
  };

  const handleCreateSuccess = () => {
    queryClient.invalidateQueries(["products"]);
    setCreateModalOpen(false);
    toast.success("✅ New product added successfully!", {
      duration: 3000,
      icon: "✅",
    });
  };

  const handleUpdateSuccess = () => {
    queryClient.invalidateQueries(["products"]);
    setEditModalOpen(false);
    setSelectedProductId(null);
    toast.success("✅ Product updated successfully!", {
      duration: 3000,
      icon: "✅",
    });
  };

  const columns = useMemo(
    () => [
      {
        name: "Image",
        selector: (row) => row.images?.[0],
        cell: (row) => (
          <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center">
            {row.images?.[0] ? (
              <img
                src={row.images[0]}
                alt={row.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <PhotoIcon className="w-6 h-6 text-gray-400" />
            )}
          </div>
        ),
        width: "80px",
      },
      {
        name: "Name",
        selector: (row) => row.name,
        sortable: true,
        grow: 2,
        cell: (row) => (
          <div className="font-medium text-gray-900">
            {row.name}
            {row.bestSeller && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                Best Seller
              </span>
            )}
          </div>
        ),
      },
      {
        name: "Price",
        selector: (row) => row.price,
        sortable: true,
        cell: (row) => (
          <div className="flex items-center gap-1 text-green-600 font-semibold">
            <CurrencyDollarIcon className="w-4 h-4" />${row.price?.toFixed(2)}
          </div>
        ),
        width: "100px",
      },
      {
        name: "Stock",
        selector: (row) => row.stock,
        cell: (row) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              row.stock > 10
                ? "bg-green-100 text-green-800"
                : row.stock > 0
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.stock === 0 ? "Out of Stock" : row.stock}
          </span>
        ),
        width: "100px",
      },
      {
        name: "Categories",
        selector: (row) => row.categories || "N/A",
        cell: (row) => (
          <div className="flex items-center gap-1 text-gray-600">
            <TagIcon className="w-4 h-4" />
            {row.categories || "N/A"}
          </div>
        ),
        grow: 1.5,
      },
      {
        name: "Brand",
        selector: (row) => row.brand || "N/A",
        cell: (row) => (
          <div className="flex items-center gap-1 text-gray-600">
            <BuildingStorefrontIcon className="w-4 h-4" />
            {row.brand || "N/A"}
          </div>
        ),
        width: "100px",
      },
      {
        name: "Actions",
        cell: (row) => (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => handleEdit(row._id)}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 hover:shadow-md"
              title="Edit Product"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDeleteInitiate(row)}
              disabled={deleteMutation.isPending}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
    ],
    [deleteMutation.isPending]
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Manage Products
              </h1>
              <p className="text-gray-600 mt-1">
                {totalRows} products • Search, edit, or delete products
              </p>
            </div>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 hover:shadow-lg flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Add Product
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PhotoIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, category, or brand..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <DataTable
            columns={columns}
            data={products}
            progressPending={isLoading}
            progressComponent={
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Loading products...</p>
              </div>
            }
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
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <ArchiveBoxIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {search
                    ? `No products found for "${search}"`
                    : "No products found"}
                </h3>
                <p className="text-gray-500">
                  {search
                    ? "Try adjusting your search terms."
                    : "Products will appear here once added."}
                </p>
                {!search && (
                  <button
                    onClick={() => setCreateModalOpen(true)}
                    className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Your First Product
                  </button>
                )}
              </div>
            }
          />
        </div>

        <CreateProduct
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
        <UpdateProduct
          productId={selectedProductId}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSuccess={handleUpdateSuccess}
        />
        <DeleteConfirmModal
          isOpen={!!deleteProduct}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          itemName={deleteProduct?.name || ""}
          itemType="Product"
        />
      </div>
    </div>
  );
};
