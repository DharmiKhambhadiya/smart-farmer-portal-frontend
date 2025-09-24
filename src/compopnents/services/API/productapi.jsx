import API from "../API/api";

export const getProducts = async () => {
  try {
    const res = await API.get("/product");
    return res.data?.data || [];
  } catch (err) {
    console.error("Failed to fetch products:", err);
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

export const searchProducts = async ({ search = "", page = 1, limit = 10 }) => {
  try {
    const res = await API.get("/product/search", {
      params: { search, page, limit },
    });
    return res.data;
  } catch (err) {
    console.error("Failed to search products:", err);
    return {
      success: false,
      data: [],
      totalProducts: 0,
      totalPages: 0,
      page: 1,
    };
  }
};

export const getLatestproduct = async () => {
  try {
    const res = await API.get("/product/latest");
    return res.data.data;
  } catch (err) {
    console.error("Failed to fetch latest products:", err);
    return [];
  }
};

export const getAllCategroies = async () => {
  try {
    const res = await API.get("/product/category");
    return res.data.data || []; // Adjusted to match response structure
  } catch (err) {
    console.error("Failed to fetch categories:", err);
    return [];
  }
};

//--------Admin API calls---------

//--------Create product----
export const createProduct = async (productData) => {
  try {
    const res = await API.post("/product", productData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("Failed to create product:", err);
    throw err; // Rethrow to let React Query handle the error
  }
};

//--------Update product----
export const updateproducts = async (productId, productData) => {
  try {
    const res = await API.put(`/product/${productId}`, productData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("Failed to update product:", err);
    throw err;
  }
};

//--------Delete product----
export const deleteproduct = async (productId) => {
  try {
    const res = await API.delete(`/product/${productId}`);
    return res.data;
  } catch (err) {
    console.error("Failed to delete product:", err);
    throw err;
  }
};
