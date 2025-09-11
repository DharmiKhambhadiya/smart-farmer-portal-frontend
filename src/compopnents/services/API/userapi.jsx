// /components/services/API/userapi.js
import API from "./api";

//signup
export const Register = async (userdata) => {
  return await API.post("/auth/register", userdata);
};
//verify otp
export const VerifyOtp = async (otpdata) => {
  return await API.post("/auth/verify-otp", otpdata);
};

//resend otp
export const ResendOtp = async (email) => {
  return await API.post("/auth/resend-otp", { email });
};

//getprofile

export const Getprofile = async () => {
  const { data } = await API.get("/auth/profile");
  return data.user;
};

//sign in
export const Signin = async (logindata) => {
  return await API.post("/auth/login", logindata);
};

//changepass
export const ChangePass = async (passworddata) => {
  return await API.post("/auth/changepass", passworddata);
};

//resetpassword link
export const ResetLinkpass = async (email) => {
  return await API.post("/auth/resetlink", { email });
};

//resetpassword
export const ResetPassword = async (token, passworddata) => {
  return await API.post(`/auth/resetpassword/${token}`, passworddata);
};
