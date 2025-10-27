import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    email: state?.order?.shippingdetails?.address?.email || "",
    phone: state?.order?.shippingdetails?.phoneNumber || "",
    address: state?.order?.shippingdetails?.address?.street || "",
    city: state?.order?.shippingdetails?.address?.city || "",
    zip: state?.order?.shippingdetails?.address?.pincode || "",
    method: "card",
    saveCard: false,
    upi: "",
  });
  const [errors, setErrors] = useState({});

  // Redirect to cart if no order data
  useEffect(() => {
    if (!state?.order) {
      toast.error("No order found. Please complete the shipping details.", {
        duration: 5000,
      });
      navigate("/cart");
    }
  }, [state, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email";
    if (!form.phone) newErrors.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(form.phone))
      newErrors.phone = "Enter a valid Indian mobile number";
    if (!form.address) newErrors.address = "Address is required";
    if (!form.city) newErrors.city = "City is required";
    if (!form.zip) newErrors.zip = "ZIP code is required";
    else if (!/^[0-9]{6}$/.test(form.zip))
      newErrors.zip = "Enter a valid 6-digit pincode";
    if (form.method === "card") {
      if (!form.nameOnCard) newErrors.nameOnCard = "Name on card is required";
      if (!form.cardNumber) newErrors.cardNumber = "Card number is required";
      else if (!/^\d{16}$/.test(form.cardNumber.replace(/\s/g, "")))
        newErrors.cardNumber = "Enter a valid 16-digit card number";
      if (!form.expiry) newErrors.expiry = "Expiry date is required";
      else if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(form.expiry))
        newErrors.expiry = "Enter a valid expiry date (MM/YY)";
      if (!form.cvc) newErrors.cvc = "CVC is required";
      else if (!/^\d{3,4}$/.test(form.cvc))
        newErrors.cvc = "Enter a valid 3- or 4-digit CVC";
    }
    if (form.method === "upi") {
      if (!form.upi) newErrors.upi = "UPI ID is required";
      else if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(form.upi))
        newErrors.upi = "Enter a valid UPI ID";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(.{4})/g, "$1 ").trim();
    setForm((prev) => ({ ...prev, cardNumber: value }));
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: null }));
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2, 4);
    setForm((prev) => ({ ...prev, expiry: value }));
    if (errors.expiry) {
      setErrors((prev) => ({ ...prev, expiry: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors below ⚠️", { duration: 4000 });
      return;
    }

    const loadingToast = toast.loading("Processing payment...");
    // Simulate payment processing (2-second delay)
    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success("✅ Payment successful!", { duration: 3000 });
      navigate("/account?tab=orders");
    }, 2000);
  };

  if (!state?.order) return null;

  const { subtotal, shippingcharges, tax, total, orderitems } = state.order;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">
            Payment
          </h1>
          <p className="text-gray-600">
            Complete your payment to finalize the order
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="md:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-5 h-fit">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3">
              {orderitems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span>
                    {item.name} (x{item.quantity})
                  </span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Shipping</span>
                  <span>₹{shippingcharges.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment and Billing */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Billing Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Email *
                  </label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-800 ${
                      errors.email
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
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
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Phone *
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    type="tel"
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-800 ${
                      errors.phone
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && (
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
                      {errors.phone}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">
                    Address *
                  </label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    type="text"
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-800 ${
                      errors.address
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="123 Green Farm Lane"
                  />
                  {errors.address && (
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
                      {errors.address}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    City *
                  </label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    type="text"
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-800 ${
                      errors.city
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="New Delhi"
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
                      {errors.city}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    ZIP *
                  </label>
                  <input
                    name="zip"
                    value={form.zip}
                    onChange={handleChange}
                    type="text"
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-800 ${
                      errors.zip
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="110001"
                  />
                  {errors.zip && (
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
                      {errors.zip}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Payment Method
              </h2>
              <div className="flex gap-3 mb-4">
                <label
                  className={`px-4 py-2 rounded-xl border cursor-pointer ${
                    form.method === "card"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value="card"
                    checked={form.method === "card"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  Card
                </label>
                <label
                  className={`px-4 py-2 rounded-xl border cursor-pointer ${
                    form.method === "cod"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value="cod"
                    checked={form.method === "cod"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  Cash on Delivery
                </label>
                <label
                  className={`px-4 py-2 rounded-xl border cursor-pointer ${
                    form.method === "upi"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value="upi"
                    checked={form.method === "upi"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  UPI
                </label>
              </div>

              {form.method === "card" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">
                      Name on Card *
                    </label>
                    <input
                      name="nameOnCard"
                      value={form.nameOnCard}
                      onChange={handleChange}
                      type="text"
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-800 ${
                        errors.nameOnCard
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="JOHN DOE"
                    />
                    {errors.nameOnCard && (
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
                        {errors.nameOnCard}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">
                      Card Number *
                    </label>
                    <input
                      name="cardNumber"
                      value={form.cardNumber}
                      onChange={handleCardNumberChange}
                      inputMode="numeric"
                      maxLength={19}
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-800 ${
                        errors.cardNumber
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="1234 5678 9012 3456"
                    />
                    {errors.cardNumber && (
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
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Expiry *
                    </label>
                    <input
                      name="expiry"
                      value={form.expiry}
                      onChange={handleExpiryChange}
                      maxLength={5}
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-800 ${
                        errors.expiry
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="MM/YY"
                    />
                    {errors.expiry && (
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
                        {errors.expiry}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      CVC *
                    </label>
                    <input
                      name="cvc"
                      value={form.cvc}
                      onChange={handleChange}
                      inputMode="numeric"
                      maxLength={4}
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-800 ${
                        errors.cvc
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="123"
                    />
                    {errors.cvc && (
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
                        {errors.cvc}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2 pt-2">
                    <input
                      id="saveCard"
                      name="saveCard"
                      type="checkbox"
                      checked={form.saveCard}
                      onChange={handleChange}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <label htmlFor="saveCard" className="text-sm text-gray-700">
                      Save card for next time
                    </label>
                  </div>
                </div>
              )}

              {form.method === "upi" && (
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      UPI ID *
                    </label>
                    <input
                      name="upi"
                      value={form.upi}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-800 ${
                        errors.upi
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="name@bank"
                    />
                    {errors.upi && (
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
                        {errors.upi}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition shadow-md"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition shadow-md hover:shadow-lg"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};


