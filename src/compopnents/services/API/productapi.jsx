import API from "../API/api";

export const getProducts = async () => {
  try {
    const res = await API.get("/product");
    return res.data?.data || [];
  } catch (err) {
    console.error("Failed to fetch products", err);
    return [];
  }
};

export const getProduct = async (id) => {
  try {
    const res = await API.get(`/product/${id}`);
    return res.data.data;
  } catch (err) {
    console.error("Failed to fetch product:", err);
    throw err;
  }
};

export const searchProducts = async () => {
  const res = await API.get("/product/search");
  return res.data;
};

export const getLatestproduct = async () => {
  const res = await API.get("/product/latest");
  return res.data;
};

export const getAllCategroies = async () => {
  const res = await API.get("/product/category");
  return res.data;
};
