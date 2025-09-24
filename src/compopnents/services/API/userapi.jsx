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
    return res.data;
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

//----------Admin API call----------
// Get All Users (Admin)
export const admingetuser = async () => {
  const res = await API.get("/auth/admin/users");
  return res.data.users; // Return the users array
};

// Update User (Admin)
export const adminUpdateUser = async (userId, userdata) => {
  const res = await API.put(`/auth/admin/user/${userId}`, userdata);
  return res.data; // { message: "User updated successfully", user }
};

// Delete User (Admin)
export const adminDeleteUser = async (userId) => {
  const res = await API.delete(`/auth/admin/user/${userId}`);
  return res.data; // { message: "User deleted successfully" }
};

// Search & Paginate Users (Admin)
export const adminSearchUsers = async ({ page, limit, search = "" }) => {
  const res = await API.get(
    `/auth/admin/users/search?page=${page}&limit=${limit}&search=${search}`
  );
  return res.data; // { success, page, totalPages, totalUsers, users }
};
