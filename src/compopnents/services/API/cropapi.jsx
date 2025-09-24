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

export const deleteCrop = async (id) => {
  try {
    const response = await API.delete(`/crop/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};