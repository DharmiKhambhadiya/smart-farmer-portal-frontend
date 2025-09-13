// /components/services/API/userapi.js
import API from "./api";

//signup
export const Register = async (userdata) => {
  return await API.post("/auth/register", userdata);
};
//verify otp
export const VerifyOtp = async ({ email, otp }) => {
  try {
    const res = await API.post("/auth/verify-otp", { email, otp });
    return res.data; // { message: "Email verified successfully", user: { id, email, role } }
  } catch (err) {
    throw err;
  }
};

//resend otp
export const ResendOtp = async ({ email }) => {
  try {
    const res = await API.post("/auth/resend-otp", { email });
    return res.data; // { message: "New OTP sent to email" }
  } catch (err) {
    throw err;
  }
};

//getprofile

export const Getprofile = async () => {
  const { data } = await API.get("/auth/profile");
  return data.user;
};

//update profile
export const updateProfile = async (userdata) => {
  return await API.put("/auth/profile", userdata);
};

//sign in
export const LoginAPI = async (data) => {
  try {
    const res = await API.post("/auth/login", data);
    return res.data; // { message: "Login successful", token, user: { id, email, role } }
  } catch (err) {
    throw err;
  }
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
