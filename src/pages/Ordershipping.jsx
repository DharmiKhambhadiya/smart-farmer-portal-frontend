import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CreateOrderAPI } from "../compopnents/services/API/orderapi";
import { updateProfile } from "../compopnents/services/API/userapi";
import { UseCartcontext } from "../compopnents/context/cartcontext";
import { useUserContext } from "../compopnents/context/Usercontext";
import { useEffect } from "react";

export const Ordershipping = () => {
  const { cartitems, ClearCart } = UseCartcontext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userData, setUserData, isLoading } = useUserContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      city: "",
      street: "",
      state: "",
      pincode: "",
      country: "",
    },
  });

  useEffect(() => {
    console.log("Ordershipping userData:", userData); // Debug log
    if (userData) {
      reset({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phoneNumber: userData.phoneNumber || "",
        city: userData.city || "",
        street: userData.address?.street || "",
        state: userData.address?.state || "",
        pincode: userData.address?.pincode || "",
        country: userData.address?.country || "",
      });
    }
  }, [userData, reset]);

  const subtotal = cartitems.reduce((acc, item) => acc + item.totalPrice, 0);
  const shippingcharges = subtotal > 1000 ? 0 : 50;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingcharges + tax;

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedData) => {
      console.log("Profile updated:", updatedData); // Debug log
      queryClient.invalidateQueries(["profile"]);
      setUserData((prev) => ({
        ...prev,
        firstName: updatedData.firstName || prev.firstName,
        lastName: updatedData.lastName || prev.lastName,
        phoneNumber: updatedData.phoneNumber || prev.phoneNumber,
        city: updatedData.city || prev.city,
        address: updatedData.address || prev.address,
      }));
      toast.success("Profile updated successfully!", { duration: 3000 });
    },
    onError: (error) => {
      console.error("Profile update error:", error); // Debug log
      toast.error(
        `❌ ${error?.response?.data?.message || "Failed to update profile"}`,
        { duration: 5000 }
      );
    },
  });

  const orderMutation = useMutation({
    mutationFn: CreateOrderAPI,
    onSuccess: (data, variables) => {
      toast.success("Order created successfully!", { duration: 3000 });
      ClearCart();
      // Redirect to payment page with order details
      navigate("/payment", {
        state: {
          order: {
            shippingdetails: variables.shippingdetails,
            orderitems: variables.orderitems,
            subtotal,
            shippingcharges,
            tax,
            total,
            orderId: data.data._id, // Assuming API returns order ID
          },
        },
      });
    },
    onError: (error) => {
      console.error("Order creation failed:", error.response?.data || error);
      toast.error("❌ Failed to create order. Try again.", { duration: 5000 });
    },
  });

  const onSubmit = (data) => {
    console.log("Ordershipping form data:", data); // Debug log
    const loadingToast = toast.loading("Processing order...");
    profileMutation.mutate(
      {
        firstName: data.firstName,
        lastName: data.lastName || "",
        phoneNumber: data.phoneNumber,
        city: data.city,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          country: data.country,
        },
      },
      {
        onSuccess: () => {
          const payload = {
            shippingdetails: {
              firstName: data.firstName,
              lastName: data.lastName || "",
              city: data.city,
              phoneNumber: data.phoneNumber,
              address: {
                street: data.street,
                city: data.city,
                state: data.state,
                pincode: data.pincode,
                country: data.country,
              },
            },
            orderitems: cartitems.map((item) => ({
              productId: item.productId,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              image: item.image,
            })),
            subtotal,
            shippingcharges,
            tax,
            total,
          };
          orderMutation.mutate(payload, {
            onSettled: () => toast.dismiss(loadingToast),
          });
        },
        onError: () => toast.dismiss(loadingToast),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shipping details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
      <div className="absolute top-10 left-10 w-32 h-32 bg-green-200 rounded-full opacity-30 blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-200 rounded-full opacity-30 blur-xl"></div>

      <div className="max-w-3xl mx-auto z-10 pt-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Shipping Details
          </h1>
          <p className="text-gray-600">
            Enter your details to proceed to payment
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name *
              </label>
              <div className="relative">
                <input
                  id="firstName"
                  type="text"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  placeholder="John"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-800 bg-gray-50"
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
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
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name
              </label>
              <div className="relative">
                <input
                  id="lastName"
                  type="text"
                  {...register("lastName")}
                  placeholder="Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-800 bg-gray-50"
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number *
            </label>
            <div className="relative">
              <input
                id="phoneNumber"
                type="tel"
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Enter a valid Indian mobile number",
                  },
                })}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-800 bg-gray-50"
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
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
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              City *
            </label>
            <div className="relative">
              <input
                id="city"
                type="text"
                {...register("city", { required: "City is required" })}
                placeholder="New Delhi"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-800 bg-gray-50"
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            {errors.city && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
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
                {errors.city.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="street"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Street Address *
            </label>
            <input
              id="street"
              type="text"
              {...register("street", { required: "Street is required" })}
              placeholder="123 Green Farm Lane"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-800 bg-gray-50"
            />
            {errors.street && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
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
                {errors.street.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                State *
              </label>
              <input
                id="state"
                type="text"
                {...register("state", { required: "State is required" })}
                placeholder="Uttar Pradesh"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-800 bg-gray-50"
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
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
                  {errors.state.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="pincode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Pincode *
              </label>
              <input
                id="pincode"
                type="text"
                {...register("pincode", {
                  required: "Pincode is required",
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: "Enter a valid 6-digit pincode",
                  },
                })}
                placeholder="110001"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-800 bg-gray-50"
              />
              {errors.pincode && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
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
                  {errors.pincode.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Country *
              </label>
              <input
                id="country"
                type="text"
                {...register("country", { required: "Country is required" })}
                placeholder="India"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-800 bg-gray-50"
              />
              {errors.country && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
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
                  {errors.country.message}
                </p>
              )}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Order Summary
            </h3>
            <p className="text-gray-600">Subtotal: ₹{subtotal.toFixed(2)}</p>
            <p className="text-gray-600">
              Shipping: ₹{shippingcharges.toFixed(2)}
            </p>
            <p className="text-gray-600">Tax: ₹{tax.toFixed(2)}</p>
            <p className="font-bold text-lg text-gray-800">
              Total: ₹{total.toFixed(2)}
            </p>
          </div>

          <button
            type="submit"
            disabled={profileMutation.isPending || orderMutation.isPending}
            className={`w-full py-3 px-6 rounded-xl font-medium text-white transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
              profileMutation.isPending || orderMutation.isPending
                ? "bg-gray-300 cursor-not-allowed text-gray-500 shadow-none"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl"
            }`}
          >
            {profileMutation.isPending || orderMutation.isPending ? (
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
                Processing...
              </>
            ) : (
              "Proceed to Payment"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
