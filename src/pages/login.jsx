import { useState } from "react";
import { Signin, ResetLinkpass } from "../compopnents/services/API/userapi";
import { useMutation } from "@tanstack/react-query";
import { Validation } from "../compopnents/services/validation/uservalidation";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UseCartcontext } from "../compopnents/context/cartcontext";

export const Login = () => {
  const [formdata, setformdata] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { MergeCart } = UseCartcontext();

  //------sign api------
  const { mutate } = useMutation({
    mutationFn: Signin,
    onSuccess: async (data) => {
      console.log("Login Successfully", data);

      const token = data.data.token;
      localStorage.setItem("token", token);

      const localCart = JSON.parse(localStorage.getItem("cartitems")) || [];
      if (localCart.length > 0) {
        try {
          await MergeCart();
          toast.success("Login successful & cart merged 🛒");
        } catch (err) {
          console.error("Cart merge failed:", err);
          toast.error("Login successful but cart merge failed");
        }
      } else {
        toast.success("Login successful 🎉");
      }

      navigate("/");
    },

    onError: (error) => {
      console.log(error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || error.message || "Login Failed"
      );
    },
  });

  const handlechange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      Validation(formdata);
      mutate(formdata);
    } catch (err) {
      toast.error(err.message);
    }
  };
  const handleResetClick = async () => {
    if (formdata.email) {
      try {
        await ResetLinkpass(formdata.email);
        toast.success("Reset password link sent to your email 📧");
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to send reset link "
        );
      }
    } else {
      toast.error("Enter your email first");
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
      <form onSubmit={handlesubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          value={formdata.email}
          onChange={handlechange}
          placeholder="Enter your email"
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          name="password"
          value={formdata.password}
          onChange={handlechange}
          placeholder="Enter your password"
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
        >
          Login
        </button>

        <p>
          Don't have an account?
          <a href="/signup" className="text-blue-700 underline">
            Signup
          </a>
        </p>

        <button
          type="button"
          onClick={handleResetClick}
          className="text-sm text-blue-700 underline mt-2"
        >
          Forgot Password?
        </button>
      </form>
    </div>
  );
};
