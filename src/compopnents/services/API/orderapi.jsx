import API from "./api";

export const CreateOrderAPI = async (payload) => {
  return await API.post("/order/create", payload);
};

export const GetMyOrdersAPI = async () => {
  return await API.get("/order/myorders");
};
