// src/components/Admin/AdminCrops.jsx
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import { searchCrop, deleteCrop } from "../../compopnents/services/API/cropapi";
import { UpdateCrop } from "../../compopnents/Admin/UpdateCrop";
import { AddCrop } from "../../compopnents/Admin/CreateCrop";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid";

// Reuse consistent table styles from AdminUsers
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

export const AdminCrops = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCropId, setEditCropId] = useState(null);
  const [cropToDelete, setCropToDelete] = useState(null);

  const queryClient = useQueryClient();

  // Fetch crops with search & pagination
  const {
    data: cropsResponse,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: [
      "crops",
      { search: searchTerm, page: currentPage, limit: perPage },
    ],
    queryFn: () => searchCrop(searchTerm, currentPage, perPage),
    select: (data) => ({
      crops: data?.data || [],
      totalPages: data?.totalpages || 1,
      totalDocuments: data?.totaldocuments || 0,
    }),
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    keepPreviousData: true,
  });

  // Debug: Log the full API response
  useEffect(() => {
    console.log("Debug: Crops API Response:", cropsResponse);
  }, [cropsResponse]);

  const crops = cropsResponse?.crops || [];
  const totalRows = cropsResponse?.totalDocuments || 0;

  // Debug: Log the crops array before rendering DataTable
  useEffect(() => {
    console.log("Debug: Crops array for DataTable:", crops);
  }, [crops]);

  // Delete mutation (unchanged)
  const deleteMutation = useMutation({
    mutationFn: (cropId) => deleteCrop(cropId),
    onMutate: async (cropId) => {
      await queryClient.cancelQueries({ queryKey: ["crops"] });
      const previous = queryClient.getQueryData([
        "crops",
        { search: searchTerm, page: currentPage, limit: perPage },
      ]);
      queryClient.setQueryData(
        ["crops", { search: searchTerm, page: currentPage, limit: perPage }],
        (old) => {
          if (!old?.crops) return old;
          return {
            ...old,
            crops: old.crops.filter((crop) => crop._id !== cropId),
            totalDocuments: Math.max(0, old.totalDocuments - 1),
          };
        }
      );
      return { previous };
    },
    onError: (err, cropId, context) => {
      queryClient.setQueryData(
        ["crops", { search: searchTerm, page: currentPage, limit: perPage }],
        context.previous
      );
      toast.error("Failed to delete crop");
    },
    onSuccess: () => {
      toast.success("Crop deleted successfully 🌱");
      setShowDeleteModal(false);
      setCropToDelete(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["crops"] });
    },
  });

  // Handle functions (unchanged)
  const handleDelete = (crop) => {
    setCropToDelete(crop);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (cropToDelete?._id) {
      deleteMutation.mutate(cropToDelete._id);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCropToDelete(null);
  };

  const handleEdit = (cropId) => {
    setEditCropId(cropId);
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
    setEditCropId(null);
  };

  const handleEditSuccess = () => {
    toast.success("Crop updated successfully ✅");
    handleEditClose();
    queryClient.invalidateQueries({ queryKey: ["crops"] });
  };

  const handleEditError = (errorMessage) => {
    toast.error(errorMessage || "Failed to update crop");
  };

  const handleAddBtn = () => {
    console.log("Debug: Add Crop button clicked");
    setShowAddModal(true);
  };

  const handleAddSuccess = () => {
    toast.success("Crop added successfully 🌿");
    setShowAddModal(false);
    queryClient.invalidateQueries({ queryKey: ["crops"] });
    setCurrentPage(1);
    setSearchTerm("");
  };

  const handleAddError = (errorMessage) => {
    toast.error(errorMessage || "Failed to add crop");
  };

  const handleAddClose = () => {
    setShowAddModal(false);
  };

  // Status badge helper (unchanged)
  const getSunExposureBadge = (exposure) => {
    switch (exposure) {
      case "Full Sun":
        return "bg-yellow-100 text-yellow-800";
      case "Partial Shade":
        return "bg-cyan-100 text-cyan-800";
      case "Full Shade":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Columns for DataTable
  const columns = [
    {
      name: "Image",
      cell: (row) => {
        // FIX: Safely access first image URL from array (like in AdminProducts)
        const imageSrc =
          row.imageUrl?.[0] ||
          "https://dummyimage.com/40x40/cccccc/969696.png&text=No+Image";

        // Debug: Log the row data for each crop (refined to show actual attempted URL)
        console.log(`Debug: Crop row data for ${row.name || "unknown"}:`, {
          id: row._id,
          name: row.name,
          rawImageUrl: row.imageUrl, // Log raw value (e.g., array)
          attemptedImageUrl: imageSrc, // Log what we're actually using
        });

        return (
          <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100">
            <img
              src={imageSrc}
              alt={row.name || "Crop Image"}
              className="h-full w-full object-cover"
              onError={(e) => {
                // FIX: Use reliable placeholder in onError
                const fallbackSrc =
                  "https://dummyimage.com/40x40/cccccc/969696.png&text=No+Image";

                // Debug: Log when an image fails to load (refined)
                console.log(
                  `Debug: Image load error for crop ${row.name || "unknown"}:`,
                  {
                    attemptedUrl: row.imageUrl?.[0] || "None (empty array)",
                    rawImageUrlType: Array.isArray(row.imageUrl)
                      ? "Array"
                      : typeof row.imageUrl,
                    error: e.message || "Image failed to load",
                  }
                );

                e.target.src = fallbackSrc;
              }}
            />
          </div>
        );
      },
      width: "80px",
      center: true,
    },
    // Other columns unchanged...
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      grow: 2,
      wrap: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
      cell: (row) => (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {row.category}
        </span>
      ),
      center: true,
    },
    {
      name: "Plant Type",
      selector: (row) => row.plantType || "N/A",
      sortable: true,
    },
    {
      name: "Sun Exposure",
      selector: (row) => row.sunExposure || "N/A",
      sortable: true,
      cell: (row) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSunExposureBadge(
            row.sunExposure
          )}`}
        >
          {row.sunExposure || "N/A"}
        </span>
      ),
      center: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row._id);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            title="Edit Crop"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
            disabled={deleteMutation.isPending}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
    },
  ];

  // Loading and Error states (unchanged, but debug log refined)
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-4 text-gray-600 text-lg">Loading crops...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    // Debug: Log the error details (refined)
    console.log("Debug: Error loading crops:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
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
              Error loading crops
            </h3>
            <p className="text-gray-600 mb-6">{error.message}</p>
            <button
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["crops"] })
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
        {/* Header (unchanged) */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">
              Manage Crops
            </h1>
            <p className="text-gray-600 mt-1">
              {totalRows > 0
                ? `${totalRows} crops available`
                : "No crops found"}
            </p>
          </div>
          <div className="mb-6">
            <button
              type="button"
              onClick={handleAddBtn}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Add Crop
            </button>
          </div>
        </div>

        {/* Search Bar (unchanged) */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-1/2 px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Crops Table (unchanged except for columns above) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <DataTable
            columns={columns}
            data={crops}
            progressPending={isLoading || isFetching}
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
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? "No crops match your search." : "No crops found."}
              </div>
            }
          />
        </div>
      </div>

      {/* Modals (unchanged) */}
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

      {/* Delete Confirmation Modal (unchanged) */}
      {showDeleteModal && cropToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Crop?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-medium">"{cropToDelete.name}"</span>? This
                action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={cancelDelete}
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
                >
                  {deleteMutation.isPending ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
