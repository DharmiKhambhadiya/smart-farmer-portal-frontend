// /pages/signup.jsx
import { useState } from "react";
import { Register } from "../compopnents/services/API/userapi";
import { useMutation } from "@tanstack/react-query";
import { Validation } from "../compopnents/services/validation/uservalidation";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const [formdata, setformdata] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const { mutate, isLoading, isError, isSuccess, error } = useMutation({
    mutationFn: Register,
    onSuccess: (data) => {
      console.log("Signup Success", data);
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
        }, 2000); // 2 seconds delay
      } else {
        toast.error(errorMessage);
      }
    },
  });

  const handlechange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handlesubmit = (e) => {
    e.preventDefault();

    try {
      Validation(formdata);
      mutate(formdata);
    } catch (validationError) {
      toast.error(validationError.message);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-4">Signup</h1>
      <form
        onSubmit={handlesubmit}
        className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email:</label>
          <input
            type="text"
            name="email"
            value={formdata.email}
            onChange={handlechange}
            placeholder="Enter Your Email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Password:
          </label>
          <input
            type="password"
            name="password"
            value={formdata.password}
            onChange={handlechange}
            placeholder="Enter Password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 rounded font-medium ${
            isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Sending OTP..." : "Sign Up"}
        </button>

        <p className="text-center">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign In
          </a>
        </p>
      </form>
    </>
  );
};
