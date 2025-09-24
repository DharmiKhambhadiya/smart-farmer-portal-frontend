import React, { useState } from "react";

export const Payment = () => {
  const [form, setForm] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    method: "card",
    saveCard: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("This is a demo form. No payment will be processed.");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Checkout</h1>
          <p className="text-gray-600">Static payment form (frontend only)</p>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="md:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-5 h-fit">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
            <ul className="space-y-3">
              <li className="flex justify-between text-sm text-gray-700">
                <span>Items</span>
                <span>$120.00</span>
              </li>
              <li className="flex justify-between text-sm text-gray-700">
                <span>Shipping</span>
                <span>$5.00</span>
              </li>
              <li className="flex justify-between text-sm text-gray-700">
                <span>Tax</span>
                <span>$9.80</span>
              </li>
              <li className="flex justify-between text-base font-semibold text-gray-900 pt-3 border-t">
                <span>Total</span>
                <span>$134.80</span>
              </li>
            </ul>
          </div>

          {/* Payment and Billing */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Billing Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  <input name="email" value={form.email} onChange={handleChange} type="email" className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-indigo-500" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} type="tel" className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-indigo-500" placeholder="(555) 000-0000" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Address</label>
                  <input name="address" value={form.address} onChange={handleChange} type="text" className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-indigo-500" placeholder="123 Farm Road" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">City</label>
                  <input name="city" value={form.city} onChange={handleChange} type="text" className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-indigo-500" placeholder="Greenfield" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">ZIP</label>
                  <input name="zip" value={form.zip} onChange={handleChange} type="text" className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-indigo-500" placeholder="12345" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h2>
              <div className="flex gap-3 mb-4">
                <label className={`px-4 py-2 rounded-xl border cursor-pointer ${form.method === "card" ? "border-indigo-500 bg-indigo-50" : "border-gray-200"}`}>
                  <input type="radio" name="method" value="card" checked={form.method === "card"} onChange={handleChange} className="hidden" />
                  Card
                </label>
                <label className={`px-4 py-2 rounded-xl border cursor-pointer ${form.method === "cod" ? "border-indigo-500 bg-indigo-50" : "border-gray-200"}`}>
                  <input type="radio" name="method" value="cod" checked={form.method === "cod"} onChange={handleChange} className="hidden" />
                  Cash on Delivery
                </label>
                <label className={`px-4 py-2 rounded-xl border cursor-pointer ${form.method === "upi" ? "border-indigo-500 bg-indigo-50" : "border-gray-200"}`}>
                  <input type="radio" name="method" value="upi" checked={form.method === "upi"} onChange={handleChange} className="hidden" />
                  UPI
                </label>
              </div>

              {form.method === "card" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Name on Card</label>
                    <input name="nameOnCard" value={form.nameOnCard} onChange={handleChange} type="text" className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-indigo-500" placeholder="JOHN DOE" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Card Number</label>
                    <input name="cardNumber" value={form.cardNumber} onChange={handleChange} inputMode="numeric" maxLength={19} className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-indigo-500" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Expiry</label>
                    <input name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/YY" className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">CVC</label>
                    <input name="cvc" value={form.cvc} onChange={handleChange} inputMode="numeric" maxLength={4} className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-indigo-500" placeholder="123" />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2 pt-2">
                    <input id="saveCard" name="saveCard" type="checkbox" checked={form.saveCard} onChange={handleChange} className="h-4 w-4" />
                    <label htmlFor="saveCard" className="text-sm text-gray-700">Save card for next time</label>
                  </div>
                </div>
              )}

              {form.method === "upi" && (
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">UPI ID</label>
                    <input name="upi" onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:border-indigo-500" placeholder="name@bank" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-md">
                Place Order (Demo)
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;


