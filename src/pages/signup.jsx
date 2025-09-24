import { useState } from "react";
import { Register } from "../compopnents/services/API/userapi";
import { useMutation } from "@tanstack/react-query";
import { Validation } from "../compopnents/services/validation/uservalidation";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const [formdata, setFormdata] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: Register,
    onSuccess: (data) => {
      toast.success(
        "OTP sent to your email! Please verify to complete registration."
      );
      navigate("/verify-otp", { state: { email: formdata.email } });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      if (errorMessage.includes("OTP already sent")) {
        toast.success(
          "OTP already sent to your email! Redirecting to verification..."
        );
        setTimeout(() => {
          navigate("/verify-otp", { state: { email: formdata.email } });
        }, 2000);
      } else {
        toast.error(errorMessage);
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      Validation(formdata);
      mutate(formdata);
    } catch (validationError) {
      toast.error(validationError.message);
    }
  };

  // Password strength helper
  const getPasswordStrength = () => {
    const length = formdata.password.length >= 8;
    const hasUpper = /[A-Z]/.test(formdata.password);
    const hasLower = /[a-z]/.test(formdata.password);
    const hasNumber = /\d/.test(formdata.password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      formdata.password
    );

    const score = [length, hasUpper, hasLower, hasNumber, hasSymbol].filter(
      (cond) => cond
    ).length;

    return score;
  };

  const strengthColor = (score) => {
    if (score === 0) return "hidden";
    if (score <= 2) return "text-red-500";
    if (score === 3) return "text-yellow-500";
    if (score >= 4) return "text-green-500";
  };

  const strengthText = (score) => {
    if (score === 0) return "";
    if (score <= 2) return "Weak";
    if (score === 3) return "Fair";
    if (score >= 4) return "Strong";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-slate-50 to-blue-50 p-6 md:p-12">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side: Attractive Text */}
        <div className="flex flex-col justify-center p-10 bg-gradient-to-br from-emerald-100 via-blue-50 to-slate-100 relative">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-3">
            Join Our <span className="text-emerald-600">Community</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-md">
            Start your farming journey with expert insights, crop management
            tools, and a community dedicated to sustainable agriculture.
          </p>

          {/* Decorative circles */}
          <div className="absolute top-8 left-8 w-20 h-20 bg-emerald-200 rounded-full opacity-30 blur-2xl"></div>
          <div className="absolute bottom-8 right-8 w-24 h-24 bg-blue-200 rounded-full opacity-30 blur-2xl"></div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Create Account
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Sign up with your email and create a secure password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address *
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formdata.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full px-3 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:outline-none transition border-gray-300 focus:ring-emerald-500"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            {/* Password Field */}
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
                  name="password"
                  value={formdata.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-3 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:outline-none transition border-gray-300 focus:ring-emerald-500"
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
                      className="h-5 w-5"
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
                      className="h-5 w-5"
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

              {/* Password Strength Indicator */}
              {formdata.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Password Strength</span>
                    <span className={strengthColor(getPasswordStrength())}>
                      {strengthText(getPasswordStrength())}
                    </span>
                  </div>
                  <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        getPasswordStrength() === 0
                          ? "w-0"
                          : getPasswordStrength() === 1
                          ? "w-1/5 bg-red-500"
                          : getPasswordStrength() === 2
                          ? "w-2/5 bg-red-500"
                          : getPasswordStrength() === 3
                          ? "w-3/5 bg-yellow-500"
                          : getPasswordStrength() === 4
                          ? "w-4/5 bg-green-500"
                          : "w-full bg-green-500"
                      }`}
                    ></div>
                  </div>
                </div>
              )}

              {/* Password Requirements */}
              <p className="mt-2 text-xs text-gray-500">
                Must be at least 8 characters with uppercase, lowercase, number,
                and symbol.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 px-5 rounded-lg font-medium text-white transition-all ${
                isLoading
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
              }`}
            >
              {isLoading ? (
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
                  Sending OTP...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-4">
            By signing up, you agree to our{" "}
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
