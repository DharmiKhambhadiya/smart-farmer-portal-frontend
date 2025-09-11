import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ChangePass } from "../compopnents/services/API/userapi";

export const ChangePassword = () => {
  const [formdata, setformdata] = useState({
    currantPassword: "",
    newPasswod: "",
    confirmPassword: "",
  });
  //ReactQuery
  const { mutate, isSuccess, isError, error } = useQuery({
    mutationFn: ChangePass,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error.response?.data?.messgae || "Failed");
    },
  });

  //Handle form submit
  const handlesubmit = (e) => {
    e.preventDefault();
    mutate(formdata);
  };
  const handlechange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };
  return (
    <>
      <h1>Change password</h1>
      <div>
        <form onSubmit={handlesubmit}>
          <label htmlFor="CurrentPassword">Cuurent Password:</label>
          <input
            type="password"
            name="CurrentPassword"
            value={formdata.currantPassword}
            onChange={handlechange}
            placeholder="Enter Your Currantpassord"
          />
          <label htmlFor="NewPassword">NewPasswod</label>
          <input
            type="password"
            name="NewPassword"
            onChange={handlechange}
            value={formdata.newPasswod}
            placeholder="Enter Your NewPassword"
          />
          <label htmlFor="ConfirmPassword">ConfirmPassword</label>
          <input
            type="password"
            name="ConfirmPassword"
            onChange={handlechange}
            value={formdata.confirmPassword}
            placeholder="Enter Your ConfirmPassword"
          />
          <button>Submit</button>
          {isSuccess && <p>Success</p>}
          {isError && <p>{error.response?.data?.message || "Failed"}</p>}
        </form>
      </div>
    </>
  );
};
