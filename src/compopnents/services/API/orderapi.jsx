// api/order.js (Updated with Admin APIs)
import API from "./api";

export const CreateOrderAPI = async (payload) => {
  return await API.post("/order/create", payload);
};

export const GetMyOrdersAPI = async () => {
  return await API.get("/order/myorders");
};

export const GetAllOrdersAPI = async () => {
  return await API.get("/order/all");
};

export const UpdateOrderStatusAPI = async (orderId, status) => {
  return await API.put(`/order/status/${orderId}`, { status });
};
