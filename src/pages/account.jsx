import { useQuery } from "@tanstack/react-query";
import { Getprofile } from "../compopnents/services/API/userapi";
import { useState, useEffect } from "react";

export const Account = () => {
  const [form, setForm] = useState({
    firstName: "",
    email: "",
    lastName: "",
    phoneNumber: "",
    city: "",
    address: "",
  });

  const handleinputchange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const { data, isLoading, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: Getprofile,
    retry: (failureCount, error) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (data) {
      setForm({
        firstName: data.firstName || "",
        email: data.email || "",
        lastName: data.lastName || "",
        phoneNumber: data.phoneNumber || "",
        city: data.address?.city || "",
        address: data.address?.address || "",
      });
    }
  }, [data]);

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Error loading profile</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          className="w-full p-2 border rounded bg-gray-100"
          onChange={handleinputchange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          className="w-full p-2 border rounded bg-gray-100"
          onChange={handleinputchange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          className="w-full p-2 border rounded bg-gray-100"
          onChange={handleinputchange}
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={form.phoneNumber}
          className="w-full p-2 border rounded bg-gray-100"
          onChange={handleinputchange}
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold">Shipping Address</h2>
        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          className="w-full p-2 border rounded bg-gray-100"
          onChange={handleinputchange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          className="w-full p-2 border rounded bg-gray-100"
          onChange={handleinputchange}
        />
      </div>
    </div>
  );
};
