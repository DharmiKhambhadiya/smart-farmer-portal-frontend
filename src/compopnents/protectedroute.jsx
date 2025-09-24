import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Check for token and role in one place
  if (!token || !user?.role) {
    toast.error("Please login first", { id: "auth-error" }); // Use unique ID to prevent duplicates
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    toast.error("Access denied", { id: "auth-error" }); // Use same ID to overwrite previous toast
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
