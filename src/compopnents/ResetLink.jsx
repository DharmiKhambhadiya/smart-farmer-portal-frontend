import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ResetPassword } from "../compopnents/services/API/userapi";
import { toast } from "react-hot-toast";

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (!passwords.newPassword || !passwords.confirmPassword) {
      toast.error("❌ Both password fields are required", { duration: 3000 });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("❌ Passwords do not match", { duration: 3000 });
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("❌ Password must be at least 6 characters", {
        duration: 3000,
      });
      return;
    }

    // Ensure token is present
    if (!token) {
      toast.error("❌ Invalid or missing reset token", { duration: 3000 });
      navigate("/login");
      return;
    }

    const loadingToast = toast.loading("Resetting password...");
    try {
      const response = await ResetPassword(token, {
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmPassword,
      });
      toast.success("✅ Password successfully reset!", { duration: 3000 });
      navigate("/login");
      return response;
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(`❌ ${message}`, { duration: 5000 });
      console.error("ResetPassword error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      if (message === "Token invalid or expired") {
        toast.error(
          "❌ The reset link is invalid or has expired. Please request a new one.",
          { duration: 5000 }
        );
        setTimeout(() => navigate("/login"), 3000);
      }
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-slate-50 to-blue-50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Reset Password
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your new password below.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password *
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:outline-none transition border-gray-300 focus:ring-emerald-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.548m1.563 4.548A10.05 10.05 0 0112 19c4.478 0 8.268-2.943 9.543-7a9.97 9.97 0 01-1.563 4.548m-1.563 4.548c-.136.136-.288.25-.454.345M12 19c4.478 0 8.268-2.943 9.543-7a9.97 9.97 0 01-1.563 4.548M12 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563 4.548"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password *
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:outline-none transition border-gray-300 focus:ring-emerald-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.548m1.563 4.548A10.05 10.05 0 0112 19c4.478 0 8.268-2.943 9.543-7a9.97 9.97 0 01-1.563 4.548m-1.563 4.548c-.136.136-.288.25-.454.345M12 19c4.478 0 8.268-2.943 9.543-7a9.97 9.97 0 01-1.563 4.548M12 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563 4.548"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-5 rounded-lg font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all"
          >
            Reset Password
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Token expired?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-emerald-600 hover:text-emerald-700 underline"
            >
              Request a new reset link
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
