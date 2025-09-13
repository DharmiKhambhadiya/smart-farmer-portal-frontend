import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { VerifyOtp, ResendOtp } from "../compopnents/services/API/userapi";
import { UseCartcontext } from "../compopnents/context/cartcontext";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

export const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const { MergeCart } = UseCartcontext();

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: VerifyOtp,
    onSuccess: async (data) => {
      toast.success("Email verified successfully!");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user?.id || data.user?._id,
          email: data.user?.email,
          role: data.user?.role,
        })
      );
      // Merge cart after OTP verification
      try {
        await MergeCart();
      } catch (err) {
        toast.error("Failed to sync cart after verification");
      }
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "OTP verification failed");
    },
  });

  const { mutate: resendOtp, isLoading: isResending } = useMutation({
    mutationFn: ResendOtp,
    onSuccess: () => {
      toast.success("New OTP sent to your email!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email not found. Please go back and sign up again.");
      navigate("/signup");
      return;
    }
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    mutate({ email, otp });
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  const handleResendOtp = () => {
    if (email) {
      resendOtp({ email });
    }
  };

  if (!email) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
        <p className="mb-4">Email not found. Please sign up first.</p>
        <button
          onClick={() => navigate("/signup")}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Go to Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Verify Your Email</h2>
      <div className="text-center mb-6">
        <p className="text-gray-600 mb-2">
          We've sent a 6-digit verification code to:
        </p>
        <p className="font-semibold text-blue-600">{email}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2 text-center">
            Enter Verification Code
          </label>
          <input
            type="text"
            value={otp}
            onChange={handleOtpChange}
            placeholder="123456"
            className="w-full px-4 py-3 border rounded text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-400"
            maxLength="6"
            autoComplete="one-time-code"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className={`w-full py-3 rounded font-medium ${
            isLoading || otp.length !== 6
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </button>
        {isError && (
          <p className="text-red-600 text-center">
            {error?.response?.data?.message || "Verification failed"}
          </p>
        )}
      </form>
      <div className="mt-6 text-center space-y-2">
        <p className="text-gray-600 text-sm">
          Didn't receive the code?{" "}
          <button
            onClick={handleResendOtp}
            disabled={isResending}
            className="text-blue-600 hover:underline disabled:text-gray-400"
          >
            {isResending ? "Sending..." : "Resend OTP"}
          </button>
        </p>
        <p className="text-gray-600 text-sm">
          Or{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-600 hover:underline"
          >
            try signing up again
          </button>
        </p>
      </div>
    </div>
  );
};
