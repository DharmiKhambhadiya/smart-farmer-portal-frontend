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

  // RHF
  const { register, handleSubmit, reset } = useForm({
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

  // Reset with fetched data
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

  // Mutation
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
      toast.success("Successfully Registered");
    },
    onError: (error) => {
      toast.error(
        "Error: " +
          (error?.response?.data?.message || "Failed to update address")
      );
    },
  });

  if (isLoading) return <p>Loading address...</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-semibold mb-4">My Address</h2>

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="space-y-3"
      >
        <input
          {...register("firstName")}
          placeholder="First Name"
          className="w-full p-2 border rounded bg-gray-100"
        />
        <input
          {...register("lastName")}
          placeholder="Last Name"
          className="w-full p-2 border rounded bg-gray-100"
        />
        <input
          {...register("street")}
          placeholder="Street"
          className="w-full p-2 border rounded bg-gray-100"
        />
        <input
          {...register("city")}
          placeholder="City"
          className="w-full p-2 border rounded bg-gray-100"
        />
        <input
          {...register("state")}
          placeholder="State"
          className="w-full p-2 border rounded bg-gray-100"
        />
        <input
          {...register("pincode")}
          placeholder="Pincode"
          className="w-full p-2 border rounded bg-gray-100"
        />
        <input
          {...register("country")}
          placeholder="Country"
          className="w-full p-2 border rounded bg-gray-100"
        />

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition disabled:bg-gray-400"
        >
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};
