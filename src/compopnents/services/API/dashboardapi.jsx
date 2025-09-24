import API from "./api";

export const GetAll = async () => {
  const res = await API.get("/dashboard/get");
  return res.data;
};

//latestorder

export const getLatestOrders = async () => {
  const res = await API.get("/order/dashboard/latest");
  return res.data;
};
