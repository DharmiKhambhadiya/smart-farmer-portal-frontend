// services/API/contactapi.js
import API from "./api";

export const Newrequest = async (formdata) => {
  return await API.post("/contact/create", formdata);
};

//------Admin API-----
//-----getallrequest-----
export const getRequests = async () => {
  const res = await API.get("/contact/getAllrequest");
  return res.data;
};

//-----getrequestbyid---- (Fixed path to match router)
export const getRequest = async (requestid) => {
  const res = await API.get(`/contact/getRequestById/${requestid}`); // Fixed: getRequestById
  return res.data;
};


//------Reply to Request----
export const replyRequest = async (requestid, formdata) => {
  return await API.put(`/contact/reply/${requestid}`, formdata);
};
