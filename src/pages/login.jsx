import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LoginAPI } from "../compopnents/services/API/userapi";
import { UseCartcontext } from "../compopnents/context/cartcontext";
import toast from "react-hot-toast";

export const Login = () => {
  const navigate = useNavigate();
  const { MergeCart } = UseCartcontext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: LoginAPI,
    onSuccess: async (data) => {
      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.user?.id || data.user?._id,
            email: data.user?.email,
            role: data.user?.role,
          })
        );
        toast.success("Login successful!");

        // Merge cart after login
        try {
          await MergeCart();
        } catch (err) {
          toast.error("Failed to sync cart after login");
        }

        navigate("/");
      } else {
        toast.error("Login failed: No token received");
      }
    },
    onError: (error) => {
      toast.error(
        "Error: " +
          (error.response?.data?.message ||
            "Login failed. Please check your credentials.")
      );
    },
  });

  const handleSubmitForm = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-slate-50 to-blue-50 p-6 md:p-12">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side: Attractive Text */}
        <div className="flex flex-col justify-center p-10 bg-gradient-to-br from-emerald-100 via-blue-50 to-slate-100 relative">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-3">
            Welcome <span className="text-emerald-600">Back</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-md">
            Sign in to access your farming dashboard, manage your crops, and
            continue your agricultural journey with us.
          </p>

          {/* Decorative circles */}
          <div className="absolute top-8 left-8 w-20 h-20 bg-emerald-200 rounded-full opacity-30 blur-2xl"></div>
          <div className="absolute bottom-8 right-8 w-24 h-24 bg-blue-200 rounded-full opacity-30 blur-2xl"></div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Sign In</h2>
          <p className="text-sm text-gray-600 mb-6">
            Please enter your credentials to access your account.
          </p>

          <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
            {/* Email */}
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
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-emerald-500"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
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
                  type="password"
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
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-emerald-500"
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={(e) => {
                    const input = e.currentTarget
                      .closest(".relative")
                      ?.querySelector("input");
                    if (input)
                      input.type =
                        input.type === "password" ? "text" : "password";
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
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
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate("/reset-password")}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={mutation.isLoading}
              className={`w-full py-2.5 px-5 rounded-lg font-medium text-white transition-all ${
                mutation.isLoading
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
              }`}
            >
              {mutation.isLoading ? (
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

            {/* Sign Up Link */}
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

          {/* Footer */}
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
    </div>
  );
};
