import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import { searchCrop, deleteCrop } from "../../compopnents/services/API/cropapi"; // Fixed typo: compopnents -> components
import { UpdateCrop } from "../../compopnents/Admin/UpdateCrop";
import { AddCrop } from "../../compopnents/Admin/CreateCrop";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  PhotoIcon,
  TagIcon,
  SunIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { DeleteConfirmModal } from "../../compopnents/Admin/Deleteconfirmation";

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Custom styles for DataTable
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

export const AdminCrops = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCropId, setEditCropId] = useState(null);
  const [deleteCrop, setDeleteCrop] = useState(null);

  const queryClient = useQueryClient();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Check admin access on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");
    if (!token || !user?.role || user.role !== "admin") {
      console.warn("Admin access check failed:", { token, user });
      toast.error("❌ Access denied. Admins only.", {
        duration: 5000,
        icon: "🔒",
      });
      setTimeout(() => (window.location.href = "/login"), 1000);
    } else {
      console.log("Admin access verified:", {
        userId: user.id,
        role: user.role,
      });
    }
  }, []);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const {
    data: cropsResponse,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: [
      "crops",
      { search: debouncedSearchTerm, page: currentPage, limit: perPage },
    ],
    queryFn: () => searchCrop(debouncedSearchTerm, currentPage, perPage),
    enabled: !!localStorage.getItem("token"),
    select: (data) => {
      if (data?.data === "No data" || !data?.data) {
        return {
          crops: [],
          totalPages: 1,
          totalDocuments: 0,
        };
      }
      return {
        crops: data?.data || [],
        totalPages: data?.totalpages || 1,
        totalDocuments: data?.totaldocuments || 0,
      };
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
    keepPreviousData: true,
    onError: (err) => {
      console.error("Query error:", {
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
      });
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to load crops";
      toast.error(`❌ ${errorMessage}`, {
        duration: 4000,
        icon: "❌",
      });
    },
  });

  const crops = cropsResponse?.crops || [];
  const totalRows = cropsResponse?.totalDocuments || 0;

  const deleteMutation = useMutation({
    mutationFn: (cropId) => {
      console.log("MutationFn: Calling deleteCrop with ID:", cropId);
      return deleteCrop(cropId);
    },
    onMutate: async (cropId) => {
      console.log("Mutating: Optimistically removing crop with ID:", cropId);
      await queryClient.cancelQueries({ queryKey: ["crops"] });
      const queryKey = [
        "crops",
        { search: debouncedSearchTerm, page: currentPage, limit: perPage },
      ];
      const previous = queryClient.getQueryData(queryKey);
      if (previous) {
        queryClient.setQueryData(queryKey, (old) => {
          if (!old?.crops) return old;
          return {
            ...old,
            crops: old.crops.filter((crop) => crop._id !== cropId),
            totalDocuments: Math.max(0, old.totalDocuments - 1),
          };
        });
      }
      return { previous };
    },
    onError: (err, cropId, context) => {
      console.error("Delete mutation error for crop ID:", cropId, {
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
      });
      queryClient.setQueryData(
        [
          "crops",
          { search: debouncedSearchTerm, page: currentPage, limit: perPage },
        ],
        context.previous
      );
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to delete crop";
      toast.error(`❌ ${errorMessage}`, {
        duration: 5000,
        icon: "❌",
      });
    },
    onSuccess: () => {
      console.log("Delete successful for crop:", deleteCrop?.name);
      toast.success(
        `✅ Crop "${deleteCrop?.name || "Unknown"}" deleted successfully! 🌱`,
        {
          duration: 3000,
          icon: "🗑️",
        }
      );
      setDeleteCrop(null);
      const currentCrops = queryClient.getQueryData([
        "crops",
        { search: debouncedSearchTerm, page: currentPage, limit: perPage },
      ])?.crops;
      if (currentCrops?.length === 0 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    },
    onSettled: () => {
      console.log("Invalidating crops query after delete");
      queryClient.invalidateQueries({
        queryKey: ["crops"],
        refetchType: "active",
      });
    },
  });

  const handleDeleteInitiate = (crop) => {
    if (!crop?._id || !crop._id.match(/^[0-9a-fA-F]{24}$/)) {
      console.error("Invalid crop ID for deletion:", crop?._id);
      toast.error("❌ Invalid crop selected for deletion", {
        duration: 5000,
        icon: "❌",
      });
      return;
    }
    console.log("Initiating delete for crop:", crop);
    toast("🗑️ Initiating crop deletion...", {
      duration: 2000,
      icon: "🗑️",
    });
    setDeleteCrop(crop);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCrop?._id) {
      console.error("No crop selected for deletion");
      toast.error("❌ No crop selected for deletion", {
        duration: 5000,
        icon: "❌",
      });
      setDeleteCrop(null);
      return;
    }
    console.log("Calling delete mutation for crop ID:", deleteCrop._id);
    const loadingToast = toast.loading("Deleting crop...");
    try {
      await deleteMutation.mutateAsync(deleteCrop._id);
    } catch (error) {
      console.error("Delete confirm error:", {
        status: error.response?.status,
        message: error.message,
      });
      // Error is handled in useMutation's onError
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleDeleteCancel = () => {
    console.log("Delete cancelled for crop:", deleteCrop?.name);
    toast("🛑 Deletion cancelled", {
      duration: 2000,
      icon: "🛑",
    });
    setDeleteCrop(null);
  };

  const handleEdit = (cropId) => {
    if (!cropId.match(/^[0-9a-fA-F]{24}$/)) {
      console.error("Invalid crop ID for edit:", cropId);
      toast.error("❌ Invalid crop ID", {
        duration: 5000,
        icon: "❌",
      });
      return;
    }
    console.log("Initiating edit for crop ID:", cropId);
    setEditCropId(cropId);
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
    setEditCropId(null);
  };

  const handleEditSuccess = () => {
    toast.success("✅ Crop updated successfully! 🌿", {
      duration: 3000,
      icon: "✅",
    });
    handleEditClose();
    queryClient.invalidateQueries({ queryKey: ["crops"] });
  };

  const handleEditError = (errorMessage) => {
    toast.error(`❌ ${errorMessage || "Failed to update crop"}`, {
      duration: 5000,
      icon: "❌",
    });
  };

  const handleAddBtn = () => {
    setShowAddModal(true);
  };

  const handleAddSuccess = () => {
    toast.success("✅ New crop added successfully! 🌱", {
      duration: 3000,
      icon: "🌱",
    });
    setShowAddModal(false);
    queryClient.invalidateQueries({ queryKey: ["crops"] });
    setCurrentPage(1);
    setSearchTerm("");
  };

  const handleAddError = (errorMessage) => {
    toast.error(`❌ ${errorMessage || "Failed to add crop"}`, {
      duration: 5000,
      icon: "❌",
    });
  };

  const handleAddClose = () => {
    setShowAddModal(false);
  };

  const getSunExposureBadge = (exposure) => {
    switch (exposure) {
      case "Full Sun":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Partial Shade":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "Full Shade":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSunExposureIcon = (exposure) => {
    switch (exposure) {
      case "Full Sun":
        return <SunIcon className="w-3 h-3" />;
      case "Partial Shade":
        return <SunIcon className="w-3 h-3 opacity-70" />;
      case "Full Shade":
        return <SunIcon className="w-3 h-3 opacity-30" />;
      default:
        return <SunIcon className="w-3 h-3" />;
    }
  };

  const columns = useMemo(
    () => [
      {
        name: "IMAGE",
        cell: (row) => {
          const imageSrc =
            row.imageUrl?.[0] ||
            "https://via.placeholder.com/40x40?text=No+Image";
          return (
            <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center">
              {row.imageUrl?.[0] ? (
                <img
                  src={imageSrc}
                  alt={row.name || "Crop Image"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/40x40?text=No+Image";
                  }}
                />
              ) : (
                <PhotoIcon className="w-5 h-5 text-gray-400" />
              )}
            </div>
          );
        },
        width: "80px",
        center: true,
      },
      {
        name: "NAME",
        selector: (row) => row.name,
        sortable: true,
        grow: 2,
        cell: (row) => (
          <div className="font-medium text-gray-900 truncate max-w-[150px]">
            {row.name}
          </div>
        ),
      },
      {
        name: "CATEGORY",
        selector: (row) => row.category,
        sortable: true,
        cell: (row) => (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            <TagIcon className="w-3 h-3 mr-1" />
            {row.category}
          </span>
        ),
        center: true,
        grow: 1.5,
      },
      {
        name: "PLANT TYPE",
        selector: (row) => row.plantType || "N/A",
        sortable: true,
        cell: (row) => (
          <div className="text-sm text-gray-600 truncate max-w-[120px]">
            {row.plantType || "N/A"}
          </div>
        ),
        grow: 2,
      },
      {
        name: "SUN EXPOSURE",
        selector: (row) => row.sunExposure || "N/A",
        sortable: true,
        cell: (row) => (
          <span
            className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${getSunExposureBadge(
              row.sunExposure
            )}`}
          >
            {getSunExposureIcon(row.sunExposure)}
            <span className="ml-1">{row.sunExposure || "N/A"}</span>
          </span>
        ),
        center: true,
        grow: 1.5,
      },
      {
        name: "ACTIONS",
        cell: (row) => (
          <div className="flex gap-2 justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row._id);
              }}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 hover:shadow-md"
              title="Edit Crop"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteInitiate(row);
              }}
              disabled={deleteMutation.isPending}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete Crop"
            >
              <TrashIcon className="w-5 h-5" />
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
    [deleteMutation.isPending]
  );

  if (isLoading) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Manage Crops
            </h1>
            <p className="text-gray-600 mt-1">Loading your crops...</p>
          </div>
          <div className="flex justify-center items-center py-32">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-600 border-t-transparent"></div>
            <span className="ml-4 text-gray-600 text-lg">Loading crops...</span>
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
              Error loading crops
            </h3>
            <p className="text-gray-600 mb-6">{error.message}</p>
            <button
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["crops"] })
              }
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 hover:shadow-lg flex items-center gap-2 mx-auto"
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
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Manage Crops
            </h1>
            <p className="text-gray-600 mt-1">
              {totalRows > 0
                ? `${totalRows} crops available`
                : "No crops found"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddBtn}
            className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 hover:shadow-lg flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add Crop
          </button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PhotoIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or category..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
            />
            {isFetching && debouncedSearchTerm && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
              </div>
            )}
          </div>
        </div>

        {totalRows > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Crops</p>
                <p className="text-2xl font-bold text-gray-900">{totalRows}</p>
              </div>
              <PhotoIcon className="w-8 h-8 text-green-600" />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Categories</p>
                <p className="text-2xl font-bold text-blue-600">
                  {new Set(crops.map((crop) => crop.category)).size}
                </p>
              </div>
              <TagIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Sun Types</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {new Set(crops.map((crop) => crop.sunExposure)).size}
                </p>
              </div>
              <SunIcon className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <DataTable
            columns={columns}
            data={crops}
            progressPending={isLoading || (isFetching && !isLoading)}
            progressComponent={
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-600 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Loading crops...</p>
              </div>
            }
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationPerPage={perPage}
            onChangePage={(page) => setCurrentPage(page)}
            onChangeRowsPerPage={(newPerPage, page) => {
              setPerPage(newPerPage);
              setCurrentPage(page);
            }}
            highlightOnHover
            pointerOnHover
            customStyles={customStyles}
            noDataComponent={
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <PhotoIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm
                    ? `No crops found for "${searchTerm}"`
                    : "No crops found"}
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Try adjusting your search terms."
                    : "Crops will appear here once added."}
                </p>
                {!searchTerm && (
                  <button
                    onClick={handleAddBtn}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Your First Crop
                  </button>
                )}
              </div>
            }
          />
        </div>

        <UpdateCrop
          isOpen={showEditModal}
          onClose={handleEditClose}
          cropId={editCropId}
          onSuccess={handleEditSuccess}
          onError={handleEditError}
        />
        <AddCrop
          isOpen={showAddModal}
          onClose={handleAddClose}
          onSuccess={handleAddSuccess}
          onError={handleAddError}
        />
        <DeleteConfirmModal
          isOpen={!!deleteCrop}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          itemName={deleteCrop?.name || ""}
          itemType="Crop"
        />
      </div>
    </div>
  );
};
