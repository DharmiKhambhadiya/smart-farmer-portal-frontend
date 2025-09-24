import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { ChangePass } from "../services/API/userapi";
import { toast } from "react-toastify";

export const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  const mutation = useMutation({
    mutationFn: (data) =>
      ChangePass({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      toast.success("Password changed successfully!");
      reset();
    },
    onError: (err) => {
      toast.error(
        "Error: " +
          (err?.response?.data?.message || "Failed to change password")
      );
    },
  });

  const onSubmit = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    mutation.mutate(data);
  };

  // Password strength helper
  const getPasswordStrength = () => {
    const length = newPassword.length >= 8;
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);

    return [length, hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean)
      .length;
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4 md:p-8">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-green-200 rounded-full opacity-30 blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-200 rounded-full opacity-30 blur-xl"></div>

      <div className="w-full max-w-md z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Change Password
          </h1>
          <p className="text-gray-600">
            Update your account security with a new password
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100"
        >
          {/* Current Password */}
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Current Password
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type="password"
                placeholder="Enter your current password"
                {...register("currentPassword", {
                  required: "Current password is required",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={(e) => {
                  const input = e.currentTarget
                    .closest(".relative")
                    ?.querySelector("input");
                  if (input)
                    input.type =
                      input.type === "password" ? "text" : "password";
                }}
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
            </div>
            {errors.currentPassword && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
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
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={(e) => {
                  const input = e.currentTarget
                    .closest(".relative")
                    ?.querySelector("input");
                  if (input)
                    input.type =
                      input.type === "password" ? "text" : "password";
                }}
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
            </div>

            {/* Strength Indicator */}
            {newPassword.length > 0 && (
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

            {errors.newPassword && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
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
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword", {
                  required: "Please confirm your new password",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={(e) => {
                  const input = e.currentTarget
                    .closest(".relative")
                    ?.querySelector("input");
                  if (input)
                    input.type =
                      input.type === "password" ? "text" : "password";
                }}
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
            </div>

            {confirmPassword && confirmPassword !== newPassword && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
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
                Passwords do not match
              </p>
            )}

            {errors.confirmPassword && !confirmPassword && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
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
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={mutation.isPending}
            className={`w-full py-3 px-6 rounded-xl font-medium text-white transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              mutation.isPending
                ? "bg-gray-300 cursor-not-allowed text-gray-500 shadow-none"
                : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-lg hover:shadow-xl"
            }`}
          >
            {mutation.isPending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline"
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
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-400 mt-8">
          Need help? Contact our support team or visit our{" "}
          <a href="#" className="hover:text-gray-600 underline">
            Help Center
          </a>
        </p>
      </div>
    </div>
  );
};
