import API from "./api";

export const getCart = async () => {
  try {
    const res = await API.get("/cart/mycart");
    console.log("Get cart API response:", res.data);
    return res.data;
  } catch (err) {
    if (err.response?.status === 404) {
      // No cart yet — treat as empty cart instead of hard error
      return { success: false, data: { items: [], subtotal: 0 } };
    }
    console.error("Failed to fetch cart:", err.response?.data || err.message);
    throw err;
  }
};

export const addCart = async (productId, quantity = 1) => {
  try {
    const res = await API.post("/cart/add", { productId, quantity });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const updateCart = async (productId, quantity) => {
  try {
    const res = await API.put("/cart/update-quantity", { productId, quantity });
    console.log("Update cart API response:", res.data);
    return res.data;
  } catch (err) {
    console.error("Update cart failed:", err.response?.data || err.message);
    throw err;
  }
};

export const mergeCart = async (items) => {
  try {
    console.log("Merge cart request payload:", items);
    const res = await API.post("/cart/mergecart", { items });
    console.log("Merge cart API response:", res.data);
    return res.data;
  } catch (err) {
    console.error("Merge cart failed:", err.response?.data || err.message);
    throw err;
  }
};

export const deleteCart = async (productId) => {
  try {
    const res = await API.delete(`/cart/${productId}`);
    console.log("Delete cart API response:", res.data);
    return res.data;
  } catch (err) {
    console.error("Delete cart failed:", err.response?.data || err.message);
    throw err;
  }
};
