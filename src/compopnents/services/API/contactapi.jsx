// services/API/contactapi.js
import API from "./api";

export const Newrequest = async (formdata) => {
  console.log("📤 Sending contact request:", formdata);
  const response = await API.post("/contact/create", formdata);
  return response.data;
};

// Admin API
export const getRequests = async () => {
  const res = await API.get("/contact/getAllrequest");
  return res.data;
};

export const getRequest = async (requestid) => {
  const res = await API.get(`/contact/getRequestById/${requestid}`);
  return res.data;
};

export const replyRequest = async (requestid, formdata) => {
  const response = await API.put(`/contact/reply/${requestid}`, formdata);
  return response.data;
};
