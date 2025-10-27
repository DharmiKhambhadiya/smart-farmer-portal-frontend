import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCrop, updateCrop } from "../../compopnents/services/API/cropapi";
import {
  XMarkIcon,
  CheckIcon,
  PhotoIcon,
  SunIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

// Helper Icons
const ChevronUpIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 15l7-7 7 7"
    />
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

export const UpdateCrop = ({ isOpen, onClose, cropId, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    name: "",
    plantType: "",
    sunExposure: "",
    soilPH: "",
    bloomTime: "",
    flowerColor: "",
    overview: "",
    category: "",
    lifecycle: [
      {
        stage: "planting",
        season: "",
        seedDepth: "",
        spacing: { row: "", plant: "" },
        sowingTips: "",
      },
      { stage: "growing", irrigationNeeds: "", fertilizer: "", careTips: [] },
    ],
    pestsAndDiseases: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [isExpanded, setIsExpanded] = useState({
    lifecycle: false,
    pests: false,
  });
  const [activeTab, setActiveTab] = useState("basic");

  const queryClient = useQueryClient();

  const {
    data: cropData,
    isLoading: isLoadingCrop,
    error: fetchError,
  } = useQuery({
    queryKey: ["crop", cropId],
    queryFn: () => getCrop(cropId),
    enabled: isOpen && !!cropId,
    onError: (err) => {
      const errorMessage = err.response?.data?.message || "Failed to load crop";
      console.error("Fetch error:", err);
      toast.error(`❌ ${errorMessage}`, {
        duration: 4000,
        icon: "❌",
      });
    },
  });

  const updateCropMutation = useMutation({
    mutationFn: (submitData) => updateCrop(cropId, submitData),
    onSuccess: () => {
      toast.success(`✅ "${formData.name}" updated successfully! 🌱`, {
        duration: 3000,
        icon: "✅",
      });
      resetForm();
      onSuccess?.();
      onClose();
      queryClient.invalidateQueries({ queryKey: ["crops"] });
      queryClient.invalidateQueries({ queryKey: ["crop", cropId] });
    },
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || "Failed to update crop";
      console.error("Update error:", err);
      toast.error(`❌ ${errorMessage}`, {
        duration: 5000,
        icon: "❌",
      });
      onError?.(errorMessage);
    },
  });

  // Initialize form data
  useEffect(() => {
    if (cropData && isOpen) {
      const getSpacingValue = (spacingObj, key) =>
        spacingObj && typeof spacingObj === "object"
          ? spacingObj[key] || ""
          : "";

      const getLifecycleData = (lifecycleData) => {
        if (!Array.isArray(lifecycleData) || lifecycleData.length === 0) {
          return [
            {
              stage: "planting",
              season: "",
              seedDepth: "",
              spacing: { row: "", plant: "" },
              sowingTips: "",
            },
            {
              stage: "growing",
              irrigationNeeds: "",
              fertilizer: "",
              careTips: [],
            },
          ];
        }

        const plantingStage = lifecycleData.find(
          (stage) => stage.stage === "planting"
        ) ||
          lifecycleData[0] || {
            stage: "planting",
            season: "",
            seedDepth: "",
            spacing: { row: "", plant: "" },
            sowingTips: "",
          };

        const growingStage = lifecycleData.find(
          (stage) => stage.stage === "growing"
        ) ||
          lifecycleData[1] || {
            stage: "growing",
            irrigationNeeds: "",
            fertilizer: "",
            careTips: [],
          };

        return [
          {
            stage: "planting",
            season: plantingStage.season || "",
            seedDepth: plantingStage.seedDepth || "",
            spacing: {
              row: getSpacingValue(plantingStage.spacing, "row"),
              plant: getSpacingValue(plantingStage.spacing, "plant"),
            },
            sowingTips: plantingStage.sowingTips || "",
          },
          {
            stage: "growing",
            irrigationNeeds: growingStage.irrigationNeeds || "",
            fertilizer: growingStage.fertilizer || "",
            careTips: Array.isArray(growingStage.careTips)
              ? growingStage.careTips
              : [],
          },
        ];
      };

      setFormData({
        name: cropData.name || "",
        plantType: cropData.plantType || "",
        sunExposure: cropData.sunExposure || "",
        soilPH: cropData.soilPH || "",
        bloomTime: cropData.bloomTime || "",
        flowerColor: cropData.flowerColor || "",
        overview: cropData.overview || "",
        category: cropData.category || "",
        lifecycle: getLifecycleData(cropData.lifecycle),
        pestsAndDiseases: Array.isArray(cropData.pestsAndDiseases)
          ? cropData.pestsAndDiseases
          : [],
      });
      setImagePreviews(
        Array.isArray(cropData.imageUrl) ? cropData.imageUrl : []
      );
      setErrors({});
    }
  }, [cropData, isOpen]);

  // Validate only editable fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Crop name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (imagePreviews.length === 0 && imageFiles.length === 0)
      newErrors.images = "At least one crop image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Only allow updates to name and category
    if (name === "name" || name === "category") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const newPreviews = [];

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          images: `Image "${file.name}" is too large. Max size: 5MB`,
        }));
        return;
      }
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          images: `"${file.name}" is not a valid image file`,
        }));
        return;
      }
      validFiles.push(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === validFiles.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (validFiles.length > 0) {
      setImageFiles((prev) => [...prev, ...validFiles]);
      if (errors.images) setErrors((prev) => ({ ...prev, images: null }));
    }
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("❌ Please fix the errors below", {
        duration: 3000,
        icon: "❌",
      });
      return;
    }

    const submitData = new FormData();

    // Append only editable fields
    submitData.append("name", formData.name || "");
    submitData.append("category", formData.category || "");

    // Append images
    const existing = (cropData?.imageUrl || []).filter((url) =>
      imagePreviews.includes(url)
    );
    if (existing.length > 0) {
      existing.forEach((url) => submitData.append("existingImages", url));
    }
    imageFiles.forEach((file) => {
      submitData.append("images", file);
    });

    // Log FormData for debugging
    for (let [key, value] of submitData.entries()) {
      console.log(`FormData: ${key} = ${value}`);
    }

    const loadingToast = toast.loading("Updating crop...");
    updateCropMutation.mutate(submitData, {
      onSettled: () => {
        toast.dismiss(loadingToast);
      },
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      plantType: "",
      sunExposure: "",
      soilPH: "",
      bloomTime: "",
      flowerColor: "",
      overview: "",
      category: "",
      lifecycle: [
        {
          stage: "planting",
          season: "",
          seedDepth: "",
          spacing: { row: "", plant: "" },
          sowingTips: "",
        },
        {
          stage: "growing",
          irrigationNeeds: "",
          fertilizer: "",
          careTips: [],
        },
      ],
      pestsAndDiseases: [],
    });
    setImageFiles([]);
    setImagePreviews([]);
    setErrors({});
    setActiveTab("basic");
    setIsExpanded({ lifecycle: false, pests: false });
  };

  const toggleSection = (section) => {
    setIsExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Edit Crop</h2>
            <p className="text-sm text-gray-600">Update crop details</p>
          </div>
          <button
            onClick={() => {
              if (
                Object.values(formData).some((value) => value) ||
                imageFiles.length > 0
              ) {
                if (
                  window.confirm(
                    "You have unsaved changes. Are you sure you want to cancel?"
                  )
                ) {
                  resetForm();
                  onClose();
                  toast("ℹ️ Changes discarded", {
                    duration: 2000,
                    icon: "🗑️",
                  });
                }
              } else {
                resetForm();
                onClose();
              }
            }}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-200"
            aria-label="Close"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex space-x-8 px-6">
            {[
              { id: "basic", label: "Basic Info", icon: PhotoIcon },
              { id: "lifecycle", label: "Lifecycle", icon: SunIcon },
              {
                id: "pests",
                label: "Pests & Diseases",
                icon: ExclamationCircleIcon,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`py-4 px-4 font-medium flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? "text-green-700 border-b-2 border-green-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <tab.icon
                  className={`w-5 h-5 ${
                    activeTab === tab.id ? "text-green-600" : "text-gray-400"
                  }`}
                />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoadingCrop ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : fetchError ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <ExclamationCircleIcon className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Error loading crop
              </h3>
              <p className="text-gray-500 mb-4">{fetchError.message}</p>
              <button
                onClick={() => queryClient.invalidateQueries(["crop", cropId])}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Retry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Tab */}
              {activeTab === "basic" && (
                <>
                  {/* Basic Information */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <PhotoIcon className="w-5 h-5 text-green-600" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          label: "Crop Name",
                          name: "name",
                          type: "text",
                          required: true,
                          editable: true,
                        },
                        {
                          label: "Category",
                          name: "category",
                          type: "select",
                          required: true,
                          editable: true,
                        },
                        {
                          label: "Plant Type",
                          name: "plantType",
                          type: "text",
                          required: false,
                          editable: false,
                        },
                        {
                          label: "Sun Exposure",
                          name: "sunExposure",
                          type: "text",
                          required: false,
                          editable: false,
                        },
                        {
                          label: "Soil pH",
                          name: "soilPH",
                          type: "text",
                          required: false,
                          editable: false,
                        },
                        {
                          label: "Bloom Time",
                          name: "bloomTime",
                          type: "text",
                          required: false,
                          editable: false,
                        },
                        {
                          label: "Flower Color",
                          name: "flowerColor",
                          type: "text",
                          required: false,
                          editable: false,
                        },
                      ].map((field) => (
                        <div key={field.name} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            {field.label}{" "}
                            {field.required && field.editable && "*"}
                          </label>
                          {field.editable && field.type === "select" ? (
                            <select
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-0 transition
                                ${
                                  errors[field.name]
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-200 hover:border-gray-300 focus:border-green-500"
                                }`}
                            >
                              <option value="">Select category</option>
                              {[
                                "Vegetables",
                                "Fruits",
                                "Herbs",
                                "Flowers",
                                "Grains",
                                "Legumes",
                                "Nuts",
                                "Roots",
                              ].map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                          ) : field.editable ? (
                            <input
                              type={field.type}
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleInputChange}
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                              className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-0 transition
                                ${
                                  errors[field.name]
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-200 hover:border-gray-300 focus:border-green-500"
                                }`}
                            />
                          ) : (
                            <p className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600">
                              {formData[field.name] || "Not specified"}
                            </p>
                          )}
                          {errors[field.name] && (
                            <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                              <ExclamationCircleIcon className="w-4 h-4" />
                              {errors[field.name]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Overview (read-only) */}
                    <div className="space-y-2 mt-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Overview
                      </label>
                      <p className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600">
                        {formData.overview || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Images */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <PhotoIcon className="w-5 h-5 text-green-600" />
                      Crop Images *
                    </h3>
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            >
                              <XMarkIcon className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <input
                      type="file"
                      name="images"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-0 transition
                        ${
                          errors.images
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-gray-300 focus:border-green-500"
                        }`}
                    />
                    {errors.images && (
                      <p className="text-sm text-red-600 font-medium flex items-center gap-1 mt-2">
                        <ExclamationCircleIcon className="w-4 h-4" />
                        {errors.images}
                      </p>
                    )}
                    {imageFiles.length > 0 && !errors.images && (
                      <p className="text-sm text-green-600 mt-1">
                        {imageFiles.length} new image(s) selected
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Lifecycle Tab (read-only) */}
              {activeTab === "lifecycle" && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <div
                    className="flex items-center justify-between cursor-pointer mb-4"
                    onClick={() => toggleSection("lifecycle")}
                  >
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <SunIcon className="w-5 h-5 text-yellow-600" />
                      Lifecycle Information
                    </h3>
                    <button
                      type="button"
                      className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200 transition"
                    >
                      {isExpanded.lifecycle ? (
                        <ChevronUpIcon className="w-5 h-5" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {isExpanded.lifecycle && (
                    <div className="space-y-4">
                      {formData.lifecycle.map((stage, index) => (
                        <div
                          key={index}
                          className="p-4 bg-white rounded-lg border border-gray-200"
                        >
                          <h4 className="font-medium text-gray-800 mb-3">
                            {stage.stage.charAt(0).toUpperCase() +
                              stage.stage.slice(1)}{" "}
                            Stage
                          </h4>
                          {index === 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Season
                                </label>
                                <p className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600">
                                  {stage.season || "Not specified"}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Seed Depth
                                </label>
                                <p className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600">
                                  {stage.seedDepth || "Not specified"}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Row Spacing
                                </label>
                                <p className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600">
                                  {stage.spacing?.row || "Not specified"}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Plant Spacing
                                </label>
                                <p className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600">
                                  {stage.spacing?.plant || "Not specified"}
                                </p>
                              </div>
                              <div className="sm:col-span-2 space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Sowing Tips
                                </label>
                                <p className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600">
                                  {stage.sowingTips || "Not specified"}
                                </p>
                              </div>
                            </div>
                          )}
                          {index === 1 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Irrigation Needs
                                </label>
                                <p className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600">
                                  {stage.irrigationNeeds || "Not specified"}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Fertilizer
                                </label>
                                <p className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600">
                                  {stage.fertilizer || "Not specified"}
                                </p>
                              </div>
                            </div>
                          )}
                          {index === 1 && (
                            <div className="space-y-3">
                              <label className="block text-sm font-medium text-gray-700">
                                Care Tips
                              </label>
                              {stage.careTips.length > 0 ? (
                                stage.careTips.map((tip, tipIndex) => (
                                  <p
                                    key={tipIndex}
                                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600"
                                  >
                                    {tip || "Not specified"}
                                  </p>
                                ))
                              ) : (
                                <p className="text-gray-600">
                                  No care tips available
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Pests & Diseases Tab (read-only) */}
              {activeTab === "pests" && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <div
                    className="flex items-center justify-between cursor-pointer mb-4"
                    onClick={() => toggleSection("pests")}
                  >
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <ExclamationCircleIcon className="w-5 h-5 text-red-600" />
                      Pests and Diseases
                    </h3>
                    <button
                      type="button"
                      className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200 transition"
                    >
                      {isExpanded.pests ? (
                        <ChevronUpIcon className="w-5 h-5" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {isExpanded.pests && (
                    <div className="space-y-4">
                      {formData.pestsAndDiseases.length > 0 ? (
                        formData.pestsAndDiseases.map((pest, index) => (
                          <div
                            key={index}
                            className="p-4 bg-white rounded-lg border border-gray-200"
                          >
                            <h4 className="font-medium text-gray-800 mb-3">
                              Pest/Disease #{index + 1}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Name
                                </label>
                                <p className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600">
                                  {pest.name || "Not specified"}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Type
                                </label>
                                <p className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600">
                                  {pest.type || "Not specified"}
                                </p>
                              </div>
                              <div className="sm:col-span-2 space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Symptoms
                                </label>
                                <p className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600">
                                  {pest.symptoms || "Not specified"}
                                </p>
                              </div>
                              <div className="sm:col-span-2 space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Solution
                                </label>
                                <p className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600">
                                  {pest.solution || "Not specified"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600">
                          No pests or diseases specified
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 -mx-6 px-6 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (
                      Object.values(formData).some((value) => value) ||
                      imageFiles.length > 0
                    ) {
                      if (
                        window.confirm(
                          "You have unsaved changes. Are you sure you want to cancel?"
                        )
                      ) {
                        resetForm();
                        onClose();
                        toast("ℹ️ Changes discarded", {
                          duration: 2000,
                          icon: "🗑️",
                        });
                      }
                    } else {
                      resetForm();
                      onClose();
                    }
                  }}
                  disabled={updateCropMutation.isPending}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    updateCropMutation.isPending ||
                    Object.keys(errors).length > 0
                  }
                  className={`px-5 py-2.5 text-sm font-medium text-white rounded-xl flex items-center gap-2 transition-all duration-200 hover:shadow-lg
                    ${
                      updateCropMutation.isPending ||
                      Object.keys(errors).length > 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    }`}
                >
                  {updateCropMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
