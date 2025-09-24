import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCrop, updateCrop } from "../../compopnents/services/API/cropapi"; // Fixed typo
import {
  XMarkIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

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
  const [isExpanded, setIsExpanded] = useState({ lifecycle: false, pests: false });

  const queryClient = useQueryClient();

  const {
    data: cropData,
    isLoading: isLoadingCrop,
    error: fetchError,
  } = useQuery({
    queryKey: ["crop", cropId],
    queryFn: () => getCrop(cropId),
    enabled: isOpen && !!cropId,
  });

  const updateCropMutation = useMutation({
    mutationFn: (submitData) => updateCrop(cropId, submitData),
    onSuccess: () => {
      toast.success("✅ Crop updated successfully!");
      onSuccess?.();
      onClose();
      queryClient.invalidateQueries({ queryKey: ["crops"] });
      queryClient.invalidateQueries({ queryKey: ["crop", cropId] });
    },
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || "Failed to update crop";
      toast.error(`❌ ${errorMessage}`);
      onError?.(errorMessage);
    },
  });

  useEffect(() => {
    if (cropData && isOpen) {
      setFormData({
        name: cropData.name || "",
        plantType: cropData.plantType || "",
        sunExposure: cropData.sunExposure || "",
        soilPH: cropData.soilPH || "",
        bloomTime: cropData.bloomTime || "",
        flowerColor: cropData.flowerColor || "",
        overview: cropData.overview || "",
        category: cropData.category || "",
        lifecycle: cropData.lifecycle || [
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
        pestsAndDiseases: cropData.pestsAndDiseases || [],
      });
      setImagePreviews(cropData.imageUrl || []);
      setErrors({});
    }
  }, [cropData, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Crop name is required";
    if (imagePreviews.length === 0 && imageFiles.length === 0)
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

    if (!validateForm()) return;

    const submitData = new FormData();

    // Append only fields we allow to update
    submitData.append("name", formData.name || "");

    // Append images: send existing image URLs separately, and new files in "images"
    const existing = (cropData?.imageUrl || []).filter((url) =>
      imagePreviews.includes(url)
    );
    if (existing.length > 0) {
      existing.forEach((url) => submitData.append("existingImages", url));
    }
    imageFiles.forEach((file) => {
      submitData.append("images", file);
    });

    updateCropMutation.mutate(submitData);
  };

  const handleClose = () => {
    if (!updateCropMutation.isPending) {
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
      onClose();
    }
  };

  const toggleSection = (section) => {
    setIsExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Edit Crop</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoadingCrop ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : fetchError ? (
            <p className="text-red-600 text-center">Error loading crop data</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
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
                                : "border-gray-200 hover:border-gray-300 focus:border-indigo-500"
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
                                : "border-gray-200 hover:border-gray-300 focus:border-indigo-500"
                            }`}
                        />
                      )}
                      {errors[field.name] && (
                        <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                          <XMarkIcon className="w-4 h-4" />
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
                          : "border-gray-200 hover:border-gray-300 focus:border-indigo-500"
                      }`}
                  />
                  {errors.overview && (
                    <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                      <XMarkIcon className="w-4 h-4" />
                      {errors.overview}
                    </p>
                  )}
                </div>
              </div>

              {/* Images */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Crop Images *
                </h3>
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={typeof preview === "string" ? preview : preview}
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
                        : "border-gray-200 hover:border-gray-300 focus:border-indigo-500"
                    }`}
                />
                {errors.images && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-1 mt-2">
                    <XMarkIcon className="w-4 h-4" />
                    {errors.images}
                  </p>
                )}
                {imageFiles.length > 0 && !errors.images && (
                  <p className="text-sm text-green-600 mt-1">
                    {imageFiles.length} new image(s) selected
                  </p>
                )}
              </div>

              {/* Lifecycle Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div
                  className="flex items-center justify-between cursor-pointer mb-4"
                  onClick={() => toggleSection("lifecycle")}
                >
                  <h3 className="text-lg font-semibold text-gray-800">
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
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
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
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
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
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
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
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
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
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
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
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
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
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
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
                                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
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
                              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
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

              {/* Pests & Diseases */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div
                  className="flex items-center justify-between cursor-pointer mb-4"
                  onClick={() => toggleSection("pests")}
                >
                  <h3 className="text-lg font-semibold text-gray-800">
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
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
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
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
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
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
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
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addPestDisease}
                      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Add Pest/Disease
                    </button>
                  </div>
                )}
              </div>

              {/* Compact Right-Aligned Buttons */}
              <div className="flex justify-end gap-3 pt-2 mt-4 border-t border-gray-100 -mx-6 px-6 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    updateCropMutation.isPending ||
                    Object.keys(errors).length > 0
                  }
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg flex items-center gap-1.5 transition
                    ${
                      updateCropMutation.isPending
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                >
                  {updateCropMutation.isPending ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-4 h-4" />
                      Save
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
