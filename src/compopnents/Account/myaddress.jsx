import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Getprofile, updateProfile } from "../services/API/userapi";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const MyAddress = () => {
  const queryClient = useQueryClient();

  // Fetch profile
  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: Getprofile,
  });

  // RHF Form Setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    },
  });

  // Reset form when user data loads
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        pincode: user.address?.pincode || "",
        country: user.address?.country || "",
      });
    }
  }, [user, reset]);

  // Mutation to update profile
  const mutation = useMutation({
    mutationFn: (data) =>
      updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          country: data.country,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
      toast.success("✅ Address updated successfully!");
    },
    onError: (error) => {
      toast.error(
        "Error: " +
          (error?.response?.data?.message || "Failed to update address")
      );
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your address...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4 md:px-8">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-green-200 rounded-full opacity-30 blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-200 rounded-full opacity-30 blur-xl"></div>

      <div className="max-w-2xl mx-auto z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Address</h1>
          <p className="text-gray-600">
            Update your shipping and contact details
          </p>
        </div>

        {/* Address Form Card */}
        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100"
        >
          {/* Name Fields - Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                {...register("firstName", {
                  required: "First name is required",
                })}
                placeholder="John"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800 bg-gray-50"
              />
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
              <input
                id="lastName"
                type="text"
                {...register("lastName", { required: "Last name is required" })}
                placeholder="Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800 bg-gray-50"
              />
              {errors.lastName && (
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
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Address Fields */}
          <div>
            <label
              htmlFor="street"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Street Address
            </label>
            <input
              id="street"
              type="text"
              {...register("street", {
                required: "Street address is required",
              })}
              placeholder="123 Green Farm Lane"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800 bg-gray-50"
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
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                City
              </label>
              <input
                id="city"
                type="text"
                {...register("city", { required: "City is required" })}
                placeholder="New Delhi"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800 bg-gray-50"
              />
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
                htmlFor="state"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                State / Province
              </label>
              <input
                id="state"
                type="text"
                {...register("state", { required: "State is required" })}
                placeholder="Uttar Pradesh"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800 bg-gray-50"
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
                ZIP / Pincode
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800 bg-gray-50"
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
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Country
            </label>
            <input
              id="country"
              type="text"
              {...register("country", { required: "Country is required" })}
              placeholder="India"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800 bg-gray-50"
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
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>

          {/* Success Message Hint */}
          <div className="mt-4 text-center text-sm text-gray-500">
            Your changes will be used for all future orders.
          </div>
        </form>
      </div>
    </div>
  );
};
