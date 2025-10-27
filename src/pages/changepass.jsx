import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ChangePass } from "../compopnents/services/API/userapi";

export const ChangePassword = () => {
  const [formdata, setFormdata] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // React Query mutation
  const { mutate, isSuccess, isError, error } = useMutation({
    mutationFn: ChangePass,
    onSuccess: (data) => {
      console.log("Password changed:", data);
    },
    onError: (error) => {
      console.error(error.response?.data?.message || error.message || "Failed");
    },
  });

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formdata);
  };

  // Handle input change
  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  return (
    <>
      <h1>Change password</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="currentPassword">Current Password:</label>
          <input
            type="password"
            name="currentPassword"
            value={formdata.currentPassword}
            onChange={handleChange}
            placeholder="Enter your current password"
          />

          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formdata.newPassword}
            onChange={handleChange}
            placeholder="Enter your new password"
          />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formdata.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your new password"
          />

          <button type="submit">Submit</button>
          {isSuccess && <p>Password changed successfully!</p>}
          {isError && (
            <p>{error?.response?.data?.message || "Password change failed"}</p>
          )}
        </form>
      </div>
    </>
  );
};
