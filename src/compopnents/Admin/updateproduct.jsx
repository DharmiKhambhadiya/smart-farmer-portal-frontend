import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProduct, updateproducts } from "../services/API/productapi";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

export const UpdateProduct = ({ productId, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    stock: 0,
    subtitle: "",
    categories: "",
    brand: "",
    description: "",
    madeIn: "",
    price: 0,
    bestSeller: false,
  });
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();

  const {
    data: product,
    isLoading: isLoadingProduct,
    error: fetchError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
    enabled: isOpen && !!productId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const updateProductMutation = useMutation({
    mutationFn: (productData) => updateproducts(productId, productData),
    onMutate: () => {
      return toast.loading("Updating product...");
    },
    onSuccess: (data, variables, context) => {
      toast.dismiss(context);
      toast.success("✅ Product updated successfully!", { duration: 3000 });
      onSuccess();
      onClose();
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
    onError: (err, variables, context) => {
      toast.dismiss(context);
      toast.error(
        `❌ ${err.response?.data?.message || "Failed to update product"}`,
        { duration: 5000 }
      );
    },
  });

  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name || "",
        stock: product.stock || 0,
        subtitle: product.subtitle || "",
        categories: product.categories || "",
        brand: product.brand || "",
        description: product.description || "",
        madeIn: product.madeIn || "",
        price: product.price || 0,
        bestSeller: product.bestSeller || false,
      });
      setExistingImages(product.images || []);
      setNewImages([]);
      setErrors({});
    }
  }, [product, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        stock: 0,
        subtitle: "",
        categories: "",
        brand: "",
        description: "",
        madeIn: "",
        price: 0,
        bestSeller: false,
      });
      setNewImages([]);
      setExistingImages([]);
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.categories.trim())
      newErrors.categories = "Categories are required";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if (formData.stock < 0) newErrors.stock = "Stock cannot be negative";
    if (existingImages.length + newImages.length === 0)
      newErrors.images = "At least one image is required";
    if (existingImages.length + newImages.length > 5)
      newErrors.images = "Maximum 5 images allowed";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (existingImages.length + files.length > 5) {
      setErrors((prev) => ({ ...prev, images: "Maximum 5 images allowed" }));
      return;
    }
    setNewImages(files);
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: null }));
    }
  };

  const handleRemoveImage = (index, isExisting = false) => {
    if (isExisting) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
    }
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors below ⚠️", { duration: 4000 });
      return;
    }

    const productData = new FormData();
    Object.keys(formData).forEach((key) => {
      productData.append(key, formData[key]);
    });
    newImages.forEach((file) => productData.append("images", file));
    if (existingImages.length > 0) {
      productData.append("existingImages", existingImages.join(","));
    }

    updateProductMutation.mutate(productData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] flex flex-col border border-gray-200/60">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200/60">
          <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100/90 transition"
            aria-label="Close"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoadingProduct ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : fetchError ? (
            <div className="text-center py-8">
              <p className="text-red-600 bg-red-50/90 p-3 rounded-lg text-sm">
                Failed to load product: {fetchError.message}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { label: "Product Name", name: "name", type: "text" },
                { label: "Stock Quantity", name: "stock", type: "number" },
                { label: "Subtitle", name: "subtitle", type: "text" },
                { label: "Categories", name: "categories", type: "text" },
                { label: "Brand", name: "brand", type: "text" },
                { label: "Made In", name: "madeIn", type: "text" },
                { label: "Price", name: "price", type: "number", step: "0.01" },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    {field.label}{" "}
                    {field.name !== "subtitle" &&
                      field.name !== "madeIn" &&
                      "*"}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    required={
                      field.name !== "subtitle" && field.name !== "madeIn"
                    }
                    min={field.type === "number" ? "0" : undefined}
                    step={field.step}
                    className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition bg-white/95 backdrop-blur-sm text-gray-900
                      ${
                        errors[field.name]
                          ? "border-red-500 bg-red-50/90"
                          : "border-gray-200/60 hover:border-gray-300 focus:border-emerald-500"
                      }`}
                  />
                  {errors[field.name] && (
                    <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                      <XMarkIcon className="w-4 h-4" />
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                  className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition bg-white/95 backdrop-blur-sm text-gray-900
                    ${
                      errors.description
                        ? "border-red-500 bg-red-50/90"
                        : "border-gray-200/60 hover:border-gray-300 focus:border-emerald-500"
                    }`}
                  placeholder="Enter product description"
                />
                {errors.description && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                    <XMarkIcon className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Best Seller */}
              <div className="flex items-center gap-3 p-3 bg-gray-50/90 rounded-xl w-fit">
                <input
                  type="checkbox"
                  name="bestSeller"
                  checked={formData.bestSeller}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300/60 rounded"
                />
                <label className="text-sm font-medium text-gray-900">
                  Best Seller
                </label>
              </div>

              {/* Existing Images */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Current Images
                </label>
                {existingImages.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {existingImages.map((url, index) => (
                      <div key={url} className="relative">
                        <img
                          src={url}
                          alt={`Product ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200/60"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index, true)}
                          className="absolute -top-2 -right-2 bg-red-600/95 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No existing images</p>
                )}
              </div>

              {/* New Images */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Upload New Images (Max 5 total) *
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition bg-white/95 backdrop-blur-sm text-gray-900
                    ${
                      errors.images
                        ? "border-red-500 bg-red-50/90"
                        : "border-gray-200/60 hover:border-gray-300 focus:border-emerald-500"
                    }`}
                />
                {errors.images && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                    <XMarkIcon className="w-4 h-4" />
                    {errors.images}
                  </p>
                )}
                {newImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newImages.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200/60"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-red-600/95 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2 mt-4 border-t border-gray-200/60 -mx-6 px-6 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-white/95 border border-gray-300/60 rounded-lg hover:bg-gray-100/90 transition shadow-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProductMutation.isPending}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg flex items-center gap-1.5 transition shadow-md
                    ${
                      updateProductMutation.isPending
                        ? "bg-gray-400/95 cursor-not-allowed"
                        : "bg-emerald-600/95 hover:bg-emerald-700/95"
                    }`}
                >
                  {updateProductMutation.isPending ? (
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
