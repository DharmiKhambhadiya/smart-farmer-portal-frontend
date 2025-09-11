import API from "./api";

export const Createorder = async () => {
  return await API.post("/order/create");
};

//Get orders for loggedin user

export const getOrder = async () => {
  return await API.get("/order/myorders");
};

