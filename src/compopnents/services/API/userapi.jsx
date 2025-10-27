import API from "./api";

// Utility to check if token exists
const checkToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  return token;
};

// Signup
export const Register = async (userdata) => {
  try {
    // Validate userdata
    if (!userdata.email || !userdata.password) {
      throw new Error("Email and password are required");
    }
    const response = await API.post("/auth/register", userdata);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error("Register error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

// Verify OTP
export const VerifyOtp = async ({ email, otp }) => {
  try {
    if (!email || !otp) {
      throw new Error("Email and OTP are required");
    }
    const response = await API.post("/auth/verify-otp", { email, otp });
    return response.data;
  } catch (error) {
    console.error("VerifyOtp error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

// Resend OTP
export const ResendOtp = async ({ email }) => {
  try {
    if (!email) {
      throw new Error("Email is required");
    }
    const response = await API.post("/auth/resend-otp", { email });
    return response.data;
  } catch (error) {
    console.error("ResendOtp error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

// Get Profile
export const Getprofile = async () => {
  try {
    checkToken();
    const { data } = await API.get("/auth/profile");
    return data.user;
  } catch (error) {
    console.error("Getprofile error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

// Update Profile
export const updateProfile = async (userdata) => {
  try {
    checkToken();
    const response = await API.put("/auth/profile", userdata);
    return response.data;
  } catch (error) {
    console.error("updateProfile error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

// Sign In
export const LoginAPI = async (data) => {
  try {
    if (!data.email || !data.password) {
      throw new Error("Email and password are required");
    }
    console.log("Login payload:", data); // Debug log
    const response = await API.post("/auth/login", data);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error("LoginAPI error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

// Change Password
export const ChangePass = async (passworddata) => {
  try {
    checkToken();

    // Ensure all fields are there
    if (
      !passworddata.currentPassword ||
      !passworddata.newPassword ||
      !passworddata.confirmPassword
    ) {
      throw new Error("All fields are required");
    }

    const response = await API.post("/auth/changepass", passworddata);
    return response.data;
  } catch (error) {
    console.error("ChangePass error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

// Reset Password Link
export const ResetLinkpass = async (email) => {
  try {
    if (!email) {
      throw new Error("Email is required");
    }
    const response = await API.post("/auth/resetlink", { email });
    return response.data;
  } catch (error) {
    console.error("ResetLinkpass error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

// Reset Password
export const ResetPassword = async (token, passworddata) => {
  try {
    if (!token || !passworddata.newPassword || !passworddata.confirmPassword) {
      throw new Error("Token and both passwords are required");
    }
    const response = await API.post(
      `/auth/resetpassword/${token}`,
      passworddata
    );
    return response.data;
  } catch (error) {
    console.error("ResetPassword error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

// ----------Admin API Calls----------
export const admingetuser = async () => {
  try {
    checkToken();
    const response = await API.get("/auth/admin/users");
    return response.data.users;
  } catch (error) {
    console.error("admingetuser error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export const adminUpdateUser = async (userId, userdata) => {
  try {
    checkToken();
    if (!userId) {
      throw new Error("User ID is required");
    }
    const response = await API.put(`/auth/admin/user/${userId}`, userdata);
    return response.data;
  } catch (error) {
    console.error("adminUpdateUser error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export const adminDeleteUser = async (userId) => {
  try {
    checkToken();
    if (!userId) {
      throw new Error("User ID is required");
    }
    const response = await API.delete(`/auth/admin/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("adminDeleteUser error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export const adminSearchUsers = async ({ page, limit, search = "" }) => {
  try {
    checkToken();
    const response = await API.get(
      `/auth/admin/users/search?page=${page}&limit=${limit}&search=${search}`
    );
    return response.data;
  } catch (error) {
    console.error("adminSearchUsers error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};
