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
    if (!formdata.name || !formdata.email || !formdata.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    mutate(formdata);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-slate-50 to-blue-50 p-6 md:p-12">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side: Attractive Text */}
        <div className="flex flex-col justify-center p-10 bg-gradient-to-br from-emerald-100 via-blue-50 to-slate-100 relative">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-3">
            Let’s Grow <span className="text-emerald-600">Together</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-md">
            Whether you have questions, feedback, or need support — we’re always
            here to help you on your farming journey.
          </p>

          {/* Decorative circles */}
          <div className="absolute top-8 left-8 w-20 h-20 bg-emerald-200 rounded-full opacity-30 blur-2xl"></div>
          <div className="absolute bottom-8 right-8 w-24 h-24 bg-blue-200 rounded-full opacity-30 blur-2xl"></div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Contact Us</h2>
          <p className="text-sm text-gray-600 mb-6">
            Fill out the form and our team will get back to you shortly.
          </p>

          <form onSubmit={handlesubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formdata.name}
                onChange={handlechange}
                placeholder="John Doe"
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formdata.email}
                onChange={handlechange}
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phonenumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number (Optional)
              </label>
              <input
                id="phonenumber"
                type="tel"
                name="phonenumber"
                value={formdata.phonenumber}
                onChange={handlechange}
                placeholder="+1 (555) 123-4567"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formdata.message}
                onChange={handlechange}
                placeholder="Tell us how we can assist you..."
                rows="4"
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 px-5 rounded-lg font-medium text-white transition-all ${
                isLoading
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
              }`}
            >
              {isLoading ? "Submitting..." : "Send Message"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-4">
            By submitting this form, you agree to our{" "}
            <a href="#" className="hover:text-emerald-600 underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="hover:text-emerald-600 underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
