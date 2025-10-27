// src/services/API/orderapi.js
import API from "./api";

export const CreateOrderAPI = async (payload) => {
  const token = localStorage.getItem("token");
  console.log("CreateOrderAPI - Token:", token); // Debug log
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await API.post("/order/create", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("CreateOrderAPI - Response:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error(
      "CreateOrderAPI - Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetMyOrdersAPI = async () => {
  const token = localStorage.getItem("token");
  console.log("GetMyOrdersAPI - Token:", token); // Debug log
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await API.get("/order/myorders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("GetMyOrdersAPI - Response:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error(
      "GetMyOrdersAPI - Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetAllOrdersAPI = async () => {
  const token = localStorage.getItem("token");
  console.log("GetAllOrdersAPI - Token:", token); // Debug log
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await API.get("/order/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("GetAllOrdersAPI - Response:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error(
      "GetAllOrdersAPI - Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const UpdateOrderStatusAPI = async (orderId, status) => {
  const token = localStorage.getItem("token");
  console.log("UpdateOrderStatusAPI - Token:", token); // Debug log
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await API.put(
      `/order/status/${orderId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("UpdateOrderStatusAPI - Response:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error(
      "UpdateOrderStatusAPI - Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};
