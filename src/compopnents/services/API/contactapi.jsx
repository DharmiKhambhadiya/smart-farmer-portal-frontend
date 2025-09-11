import API from "./api";

export const Newrequest = async (formdata) => {
  return await API.post("/contact/create", formdata);
};
