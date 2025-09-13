import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { ChangePass } from "../services/API/userapi";
import { toast } from "react-toastify";

export const ChangePassword = () => {
  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      ChangePass({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      toast.success("Successfully Registered");
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
      toast.error("Error: New passwords do not match!");
      return;
    }
    mutation.mutate(data);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <input
          type="password"
          placeholder="Current Password"
          {...register("currentPassword", { required: true })}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="New Password"
          {...register("newPassword", { required: true })}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          {...register("confirmPassword", { required: true })}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          {mutation.isPending ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};
