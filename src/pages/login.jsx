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

        navigate("/shop");
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

  const handlesubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Login
        </h1>
        <form onSubmit={handleSubmit(handlesubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              {...register("email", { required: "Email is required" })}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register("password", { required: "Password is required" })}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Need an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-600 hover:underline"
            >
              Sign Up
            </button>
          </p>
          <p className="text-gray-600 text-sm">
            Forgot password?{" "}
            <button
              onClick={() => navigate("/reset-password")}
              className="text-blue-600 hover:underline"
            >
              Reset Password
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
