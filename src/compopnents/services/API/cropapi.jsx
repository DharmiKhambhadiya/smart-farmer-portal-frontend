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

// Search crop
export const searchCrop = async (query) => {
  const res = await API.get(`/crop/search?query=${query}`);
  return res.data;
};
