import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Getprofile, updateProfile } from "../services/API/userapi";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const Profile = () => {
  const queryClient = useQueryClient();

  // Fetch user profile
  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: Getprofile,
  });

  // React Hook Form setup
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      city: "",
    },
  });

  // Reset form when user data is fetched
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        city: user.city || "",
      });
    }
  }, [user, reset]);

  // Mutation for updating profile
  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
      toast.success("Successfully Registered");
    },
    onError: (error) => {
      toast.error(
        "Error: " +
          (error?.response?.data?.message || "Failed to update profile")
      );
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  if (isLoading) return <p>Loading profile...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Account Details</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4"
      >
        <input
          type="text"
          placeholder="First Name"
          {...register("firstName")}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Last Name"
          {...register("lastName")}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Phone Number"
          {...register("phoneNumber")}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="City"
          {...register("city")}
          className="p-2 border rounded"
        />

        <button
          type="submit"
          disabled={mutation.isPending}
          className="col-span-2 mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};
