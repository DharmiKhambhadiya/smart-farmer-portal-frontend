import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CreateOrderAPI } from "../compopnents/services/API/orderapi";
import { UseCartcontext } from "../compopnents/context/cartcontext";

export const Ordershipping = () => {
  const { cartitems } = UseCartcontext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const subtotal = cartitems.reduce((acc, item) => acc + item.totalPrice, 0);
  const shippingcharges = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shippingcharges;

  const mutation = useMutation({
    mutationFn: CreateOrderAPI,
    onSuccess: () => {
      toast.success("Order placed successfully!");
      navigate("/orders");
    },
    onError: (error) => {
      console.error("Order creation failed:", error.response?.data || error);
      toast.error("Failed to place order. Try again.");
    },
  });

  const onSubmit = (data) => {
    const payload = {
      shippingdetails: {
        firstName: data.firstName,
        lastName: data.lastName || "", // make sure lastName is not undefined
        city: data.city,
        phoneNumber: data.phoneNumber,
        address: {
          street: data.street,
          state: data.state,
          pincode: data.pincode,
        },
      },
      subtotal,
      shippingcharges,
      total,
    };
    mutation.mutate(payload);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Shipping Details
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* First & Last Name */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              {...register("firstName", { required: "First name is required" })}
              placeholder="First Name"
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              {...register("lastName")}
              placeholder="Last Name"
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            {...register("phoneNumber", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter a valid 10-digit phone number",
              },
            })}
            placeholder="Phone Number"
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            {...register("city", { required: "City is required" })}
            placeholder="City"
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
          )}
        </div>

        {/* Street */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Street Address
          </label>
          <input
            {...register("street", { required: "Street is required" })}
            placeholder="Street Address"
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {errors.street && (
            <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>
          )}
        </div>

        {/* State & Pincode */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input
              {...register("state", { required: "State is required" })}
              placeholder="State"
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">
                {errors.state.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pincode</label>
            <input
              {...register("pincode", {
                required: "Pincode is required",
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "Enter a valid 6-digit pincode",
                },
              })}
              placeholder="Pincode"
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.pincode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.pincode.message}
              </p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="p-4 bg-gray-100 rounded-lg mt-4">
          <p>Subtotal: ₹{subtotal}</p>
          <p>Shipping: ₹{shippingcharges}</p>
          <p className="font-bold text-lg">Total: ₹{total}</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={mutation.isLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
        >
          {mutation.isLoading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};
