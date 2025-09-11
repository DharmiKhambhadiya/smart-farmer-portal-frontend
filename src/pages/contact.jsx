import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Newrequest } from "../compopnents/services/API/contactapi";
import { toast } from "react-hot-toast";

export const Contact = () => {
  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    phonenumber: "",
    subject: "",
    message: "",
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: Newrequest,
    onSuccess: (data) => {
      toast.success(data?.message || "Request submitted successfully!");
      setformdata({
        name: "",
        email: "",
        phonenumber: "",
        subject: "",
        message: "",
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  const handlechange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!formdata.name || !formdata.email || !formdata.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    mutate(formdata); // token automatically included via API
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
        Contact Support
      </h1>

      <form onSubmit={handlesubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formdata.name}
          onChange={handlechange}
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formdata.email}
          onChange={handlechange}
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
        />

        <input
          type="tel"
          name="phonenumber"
          placeholder="Phone Number"
          value={formdata.phonenumber}
          onChange={handlechange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
        />

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formdata.subject}
          onChange={handlechange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
        />

        <textarea
          name="message"
          placeholder="Your Message"
          value={formdata.message}
          onChange={handlechange}
          required
          rows="5"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};
