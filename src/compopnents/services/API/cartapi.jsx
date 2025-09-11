// cartapi.js
import API from "./api";

// Add to cart
export const addCart = async (productId, quantity = 1) => {
  const res = await API.post("/cart/add", { productId, quantity });
  return res.data; // Changed from res.data.data to match backend
};

// Update quantity
export const updateCart = async (productId, quantity) => {
  const res = await API.put("/cart/update-quantity", { productId, quantity });
  return res.data; // Changed
};

// Get cart
export const getCart = async () => {
  const res = await API.get("/cart/mycart");
  return res.data; // Backend returns { success: true, data: { items, subtotal } }
};

// Merge cart
export const mergeCart = async (items) => {
  const res = await API.post("/cart/mergecart", { items });
  return res.data;
};

// Delete cart item
export const deleteCart = async (productId) => {
  const res = await API.delete(`/cart/${productId}`);
  return res.data;
};
