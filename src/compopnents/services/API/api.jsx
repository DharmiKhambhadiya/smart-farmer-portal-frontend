import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`Request to ${config.url}:`, {
      headers: config.headers,
      method: config.method,
      data: config.data || "No data",
    });
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(`Response error for ${error.config.url}:`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    if (error.response?.status === 401) {
      console.warn(
        "Unauthorized request - clearing token and redirecting to login"
      );
      localStorage.removeItem("token");
      window.location.href = "/login"; // Adjust redirect path as needed
    }
    return Promise.reject(error);
  }
);

export default API;
