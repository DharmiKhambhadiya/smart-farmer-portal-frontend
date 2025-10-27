import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LoginAPI, ResetLinkpass } from "../compopnents/services/API/userapi";
import { UseCartcontext } from "../compopnents/context/cartcontext";
import { toast } from "react-hot-toast";
import { useState } from "react";

export const Login = () => {
  const navigate = useNavigate();
  const { MergeCart } = UseCartcontext();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: LoginAPI,
    onSuccess: async (data, variables) => {
      if (data?.token) {
        localStorage.setItem("token", data.token);
        const userData = {
          id: data.user?.id || data.user?._id,
          firstName: data.user?.firstName || "",
          lastName: data.user?.lastName || "",
          email: data.user?.email,
          role: data.user?.role,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        if (userData.role === "admin") {
          localStorage.setItem("admin", JSON.stringify(userData));
        }
        toast.success("✅ Login successful!", { duration: 3000 });
        try {
          await MergeCart();
          toast.success("✅ Cart synced successfully!", { duration: 3000 });
        } catch (err) {
          toast.error("❌ Cart: Failed to sync cart after login", {
            duration: 5000,
          });
        }
        navigate(userData.role === "admin" ? "/admin" : "/");
      } else {
        toast.error("❌ Login: No token received", { duration: 5000 });
      }
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      toast.error(`❌ Login: ${message}`, { duration: 5000 });
    },
  });

  const resetLinkMutation = useMutation({
    mutationFn: ResetLinkpass,
    onSuccess: () => {
      toast.success("✅ Reset link sent to your email!", { duration: 3000 });
      setShowForgotPassword(false);
      setForgotEmail("");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to send reset link.";
      toast.error(`❌ ${message}`, { duration: 5000 });
    },
  });

  const onSubmit = (data) => {
    const loadingToast = toast.loading("Processing login...");
    loginMutation.mutate(data, {
      onSettled: () => toast.dismiss(loadingToast),
    });
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("❌ Please enter your email", { duration: 3000 });
      return;
    }
    const loadingToast = toast.loading("Sending reset link...");
    resetLinkMutation.mutate(forgotEmail, {
      onSettled: () => toast.dismiss(loadingToast),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-slate-50 to-blue-50 p-6 md:p-12">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center p-10 bg-gradient-to-br from-emerald-100 via-blue-50 to-slate-100 relative">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-3">
            Welcome <span className="text-emerald-600">Back</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-md">
            Sign in to access your farming dashboard, manage your crops, and
            continue your agricultural journey with us.
          </p>
          <div className="absolute top-8 left-8 w-20 h-20 bg-emerald-200 rounded-full opacity-30 blur-2xl"></div>
          <div className="absolute bottom-8 right-8 w-24 h-24 bg-blue-200 rounded-full opacity-30 blur-2xl"></div>
        </div>

        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Sign In</h2>
          <p className="text-sm text-gray-600 mb-6">
            Please enter your credentials to access your account.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name *
              </label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                {...register("firstName", {
                  required: "First Name is required",
                  minLength: {
                    value: 2,
                    message: "First Name must be at least 2 characters",
                  },
                })}
                placeholder="John"
                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:outline-none transition ${
                  errors.firstName
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 focus:ring-emerald-500"
                }`}
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
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
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                placeholder="you@example.com"
                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:outline-none transition ${
                  errors.email
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 focus:ring-emerald-500"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
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
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:outline-none transition ${
                    errors.password
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 focus:ring-emerald-500"
                  }`}
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
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
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
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className={`w-full py-2.5 px-5 rounded-lg font-medium text-white transition-all ${
                loginMutation.isPending
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
              }`}
            >
              {loginMutation.isPending ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 inline"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors underline"
                >
                  Create Account
                </button>
              </p>
            </div>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            By signing in, you agree to our{" "}
            <a href="#" className="hover:text-emerald-600 underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="hover:text-emerald-600 underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Forgot Password
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter your email address to receive a password reset link.
            </p>
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="forgotEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address *
                </label>
                <input
                  id="forgotEmail"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:outline-none transition border-gray-300 focus:ring-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLinkMutation.isPending}
                  className={`px-4 py-2 rounded-lg font-medium text-white transition-all ${
                    resetLinkMutation.isPending
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-emerald-500 hover:bg-emerald-600"
                  }`}
                >
                  {resetLinkMutation.isPending
                    ? "Sending..."
                    : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
