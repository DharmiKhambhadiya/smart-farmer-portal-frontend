import API from "../API/api";

// Get all crops
export const getCrops = async () => {
  const res = await API.get("/crop");
  return res.data.data;
};

// Get crop by Id
export const getCrop = async (id) => {
  const res = await API.get(`/crop/${id}`);
  return res.data.data;
};

// Get latest crops
export const getLatest = async () => {
  const res = await API.get("/crop/latest");
  return res.data.data;
};

// Get category
export const getCategory = async () => {
  const res = await API.get("/crop/category");
  return res.data.data;
};

// Search crop with pagination
export const searchCrop = async (query = "", page = 1) => {
  const res = await API.get(`/crop/search?search=${query}&page=${page}`);
  return res.data;
};

// Admin API functions
export const createCrop = async (cropData) => {
  try {
    const response = await API.post("/crop", cropData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin Update crop detail
export const updateCrop = async (id, formData) => {
  try {
    const response = await API.put(`/crop/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ... (other API functions remain unchanged)

// Delete crop by ID
// Delete crop by ID
export const deleteCrop = async (id) => {
  try {
    if (!id) {
      throw new Error("Crop ID is required");
    }
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error("Invalid crop ID format");
    }
    console.log("Attempting to delete crop with ID:", id);
    const response = await API.delete(`/crop/${id}`);
    console.log("Delete crop response:", {
      status: response.status,
      data: response.data,
    });
    return response.data;
  } catch (error) {
    console.error("Delete crop error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw (
      error.response?.data?.message || error.message || "Failed to delete crop"
    );
  }
};

// ... (other API functions)
