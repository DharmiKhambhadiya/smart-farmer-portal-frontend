// src/components/Admin/CreateCrop.jsx
import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCrop, getCrops } from "../../compopnents/services/API/cropapi";
import {
  XMarkIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon,
  PhotoIcon,
  TagIcon,
  SunIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

// Helper Icons (redefined for better consistency)
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

export const AddCrop = ({ isOpen, onClose, onSuccess, onError }) => {
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
      {
        stage: "growing",
        irrigationNeeds: "",
        fertilizer: "",
        careTips: [],
      },
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

  // Fetch existing crops to check for duplicates
  const { data: crops = [] } = useQuery({
    queryKey: ["crops"],
    queryFn: getCrops,
    enabled: isOpen,
  });

  const createCropMutation = useMutation({
    mutationFn: (submitData) => createCrop(submitData),
    onSuccess: () => {
      toast.success(`✅ "${formData.name}" created successfully! 🌱`, {
        duration: 3000,
        icon: "🌱",
      });
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["crops"] });
      onSuccess?.();
      onClose();
    },
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || "Failed to create crop";
      toast.error(`❌ ${errorMessage}`, {
        duration: 5000,
        icon: "❌",
      });
      onError?.(errorMessage);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      plantType: "",
      sunExposure: "",
      soilPH: "",
      bloomTime: "",
      flowerColor: "",
      overview: "",
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
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Crop name is required";
    else if (
      crops.some(
        (crop) => crop.name.toLowerCase() === formData.name.toLowerCase()
      )
    ) {
      newErrors.name = "This crop name already exists";
    }
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.plantType.trim())
      newErrors.plantType = "Plant type is required";
    if (!formData.sunExposure)
      newErrors.sunExposure = "Sun exposure is required";
    if (!formData.soilPH.trim()) newErrors.soilPH = "Soil pH is required";
    if (!formData.overview.trim()) newErrors.overview = "Overview is required";
    if (imageFiles.length === 0)
      newErrors.images = "At least one crop image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleLifecycleChange = (index, field, value) => {
    const newLifecycle = [...formData.lifecycle];
    if (field === "spacing") {
      newLifecycle[index] = {
        ...newLifecycle[index],
        spacing: { ...newLifecycle[index].spacing, ...value },
      };
    } else if (field === "careTips") {
      newLifecycle[index] = {
        ...newLifecycle[index],
        [field]: value,
      };
    } else {
      newLifecycle[index] = { ...newLifecycle[index], [field]: value };
    }
    setFormData((prev) => ({ ...prev, lifecycle: newLifecycle }));
  };

  const handleCareTipsChange = (stageIndex, tipIndex, value) => {
    const newLifecycle = [...formData.lifecycle];
    const newCareTips = [...newLifecycle[stageIndex].careTips];
    newCareTips[tipIndex] = value;
    newLifecycle[stageIndex] = {
      ...newLifecycle[stageIndex],
      careTips: newCareTips,
    };
    setFormData((prev) => ({ ...prev, lifecycle: newLifecycle }));
  };

  const addCareTip = (stageIndex) => {
    const newLifecycle = [...formData.lifecycle];
    newLifecycle[stageIndex] = {
      ...newLifecycle[stageIndex],
      careTips: [...newLifecycle[stageIndex].careTips, ""],
    };
    setFormData((prev) => ({ ...prev, lifecycle: newLifecycle }));
  };

  const removeCareTip = (stageIndex, tipIndex) => {
    const newLifecycle = [...formData.lifecycle];
    const newCareTips = newLifecycle[stageIndex].careTips.filter(
      (_, i) => i !== tipIndex
    );
    newLifecycle[stageIndex] = {
      ...newLifecycle[stageIndex],
      careTips: newCareTips,
    };
    setFormData((prev) => ({ ...prev, lifecycle: newLifecycle }));
  };

  const handlePestInputChange = (index, field, value) => {
    const newPests = [...formData.pestsAndDiseases];
    if (!newPests[index]) {
      newPests[index] = { name: "", symptoms: "", solution: "", type: "" };
    }
    newPests[index] = { ...newPests[index], [field]: value };
    setFormData((prev) => ({ ...prev, pestsAndDiseases: newPests }));
  };

  const addPestDisease = () => {
    setFormData((prev) => ({
      ...prev,
      pestsAndDiseases: [
        ...prev.pestsAndDiseases,
        { name: "", symptoms: "", solution: "", type: "" },
      ],
    }));
  };

  const removePestDisease = (index) => {
    const newPests = formData.pestsAndDiseases.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, pestsAndDiseases: newPests }));
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

    const data = new FormData();

    // Append text fields
    Object.keys(formData).forEach((key) => {
      if (key === "lifecycle" || key === "pestsAndDiseases") {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });

    // Append images
    imageFiles.forEach((file) => {
      data.append("images", file);
    });

    createCropMutation.mutate(data);
  };

  const handleClose = () => {
    if (!createCropMutation.isPending) {
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
    }
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
            <h2 className="text-xl font-bold text-gray-800">Add New Crop</h2>
            <p className="text-sm text-gray-600">Fill in all required fields</p>
          </div>
          <button
            onClick={handleClose}
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
                      },
                      {
                        label: "Category",
                        name: "category",
                        type: "select",
                        required: true,
                      },
                      {
                        label: "Plant Type",
                        name: "plantType",
                        type: "text",
                        required: true,
                      },
                      {
                        label: "Sun Exposure",
                        name: "sunExposure",
                        type: "select",
                        required: true,
                      },
                      {
                        label: "Soil pH",
                        name: "soilPH",
                        type: "text",
                        required: true,
                      },
                      {
                        label: "Bloom Time",
                        name: "bloomTime",
                        type: "text",
                        required: false,
                      },
                      {
                        label: "Flower Color",
                        name: "flowerColor",
                        type: "text",
                        required: false,
                      },
                    ].map((field) => (
                      <div key={field.name} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {field.label} {field.required && "*"}
                        </label>
                        {field.type === "select" ? (
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
                            <option value="">
                              {field.name === "category"
                                ? "Select category"
                                : field.name === "sunExposure"
                                ? "Select sun exposure"
                                : "Select..."}
                            </option>
                            {field.name === "category" &&
                              [
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
                            {field.name === "sunExposure" &&
                              ["Full Sun", "Partial Shade", "Shade"].map(
                                (exp) => (
                                  <option key={exp} value={exp}>
                                    {exp}
                                  </option>
                                )
                              )}
                          </select>
                        ) : (
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

                  {/* Overview */}
                  <div className="space-y-2 mt-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Overview *
                    </label>
                    <textarea
                      name="overview"
                      value={formData.overview}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Provide a brief overview..."
                      className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-0 transition
                        ${
                          errors.overview
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-gray-300 focus:border-green-500"
                        }`}
                    />
                    {errors.overview && (
                      <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                        <ExclamationCircleIcon className="w-4 h-4" />
                        {errors.overview}
                      </p>
                    )}
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
                      {imageFiles.length} image(s) selected
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Lifecycle Tab */}
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
                          {stage.stage} Stage
                        </h4>
                        {index === 0 && ( // Planting stage fields
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Season
                              </label>
                              <select
                                value={stage.season}
                                onChange={(e) =>
                                  handleLifecycleChange(
                                    index,
                                    "season",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                              >
                                <option value="">Select season</option>
                                {["Spring", "Summer", "Fall", "Winter"].map(
                                  (s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Seed Depth
                              </label>
                              <input
                                type="text"
                                value={stage.seedDepth}
                                onChange={(e) =>
                                  handleLifecycleChange(
                                    index,
                                    "seedDepth",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., 1/4 inch"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Row Spacing
                              </label>
                              <input
                                type="text"
                                value={stage.spacing.row}
                                onChange={(e) =>
                                  handleLifecycleChange(index, "spacing", {
                                    row: e.target.value,
                                  })
                                }
                                placeholder="e.g., 18 inches"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Plant Spacing
                              </label>
                              <input
                                type="text"
                                value={stage.spacing.plant}
                                onChange={(e) =>
                                  handleLifecycleChange(index, "spacing", {
                                    plant: e.target.value,
                                  })
                                }
                                placeholder="e.g., 12 inches"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                              />
                            </div>
                            <div className="sm:col-span-2 space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Sowing Tips
                              </label>
                              <textarea
                                value={stage.sowingTips}
                                onChange={(e) =>
                                  handleLifecycleChange(
                                    index,
                                    "sowingTips",
                                    e.target.value
                                  )
                                }
                                rows={2}
                                placeholder="Additional tips for sowing..."
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                              />
                            </div>
                          </div>
                        )}
                        {index === 1 && ( // Growing stage fields
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Irrigation Needs
                              </label>
                              <select
                                value={stage.irrigationNeeds}
                                onChange={(e) =>
                                  handleLifecycleChange(
                                    index,
                                    "irrigationNeeds",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                              >
                                <option value="">
                                  Select irrigation needs
                                </option>
                                {["Low", "Moderate", "High"].map((n) => (
                                  <option key={n} value={n}>
                                    {n}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Fertilizer
                              </label>
                              <input
                                type="text"
                                value={stage.fertilizer}
                                onChange={(e) =>
                                  handleLifecycleChange(
                                    index,
                                    "fertilizer",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., Balanced NPK"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                              />
                            </div>
                          </div>
                        )}
                        {index === 1 && (
                          <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                              Care Tips
                            </label>
                            {stage.careTips.map((tip, tipIndex) => (
                              <div key={tipIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={tip}
                                  onChange={(e) =>
                                    handleCareTipsChange(
                                      index,
                                      tipIndex,
                                      e.target.value
                                    )
                                  }
                                  placeholder={`Care tip ${tipIndex + 1}`}
                                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeCareTip(index, tipIndex)}
                                  className="px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition"
                                >
                                  <XMarkIcon className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addCareTip(index)}
                              className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                            >
                              <PlusIcon className="w-4 h-4" />
                              Add Care Tip
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Pests & Diseases Tab */}
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
                    {formData.pestsAndDiseases.map((pest, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white rounded-lg border border-gray-200"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-800">
                            Pest/Disease #{index + 1}
                          </h4>
                          {formData.pestsAndDiseases.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePestDisease(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Name
                            </label>
                            <input
                              type="text"
                              value={pest.name || ""}
                              onChange={(e) =>
                                handlePestInputChange(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., Aphids"
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Type
                            </label>
                            <select
                              value={pest.type || ""}
                              onChange={(e) =>
                                handlePestInputChange(
                                  index,
                                  "type",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                            >
                              <option value="">Select type</option>
                              <option value="Pest">Pest</option>
                              <option value="Disease">Disease</option>
                            </select>
                          </div>
                          <div className="sm:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Symptoms
                            </label>
                            <textarea
                              value={pest.symptoms || ""}
                              onChange={(e) =>
                                handlePestInputChange(
                                  index,
                                  "symptoms",
                                  e.target.value
                                )
                              }
                              rows={2}
                              placeholder="Describe the symptoms..."
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                            />
                          </div>
                          <div className="sm:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Solution
                            </label>
                            <textarea
                              value={pest.solution || ""}
                              onChange={(e) =>
                                handlePestInputChange(
                                  index,
                                  "solution",
                                  e.target.value
                                )
                              }
                              rows={2}
                              placeholder="Provide solution or treatment..."
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addPestDisease}
                      className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Add Pest/Disease
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 -mx-6 px-6 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={createCropMutation.isPending}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  createCropMutation.isPending || Object.keys(errors).length > 0
                }
                className={`px-5 py-2.5 text-sm font-medium text-white rounded-xl flex items-center gap-2 transition-all duration-200 hover:shadow-lg
                  ${
                    createCropMutation.isPending
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  }`}
              >
                {createCropMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    Add Crop
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
