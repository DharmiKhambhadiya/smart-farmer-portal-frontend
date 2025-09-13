import { useQuery } from "@tanstack/react-query";
import { GetMyOrdersAPI } from "../services/API/orderapi";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const Orders = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: GetMyOrdersAPI,
  });

  const orders = Array.isArray(data?.data?.data) ? data.data.data : [];

  useEffect(() => {
    if (isError) {
      toast.error("Error: Failed to fetch orders.");
    }
    if (!isLoading && orders.length === 0) {
      toast.info("No orders found.");
    }
  }, [isError, isLoading, orders.length]);

  if (isLoading) return <p>Loading orders...</p>;
  if (isError) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-6 border rounded-lg shadow bg-white"
            >
              {/* Order Status */}
              <div className="flex justify-between items-center mb-4">
                <span
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {order.orderitems?.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 border-b pb-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-4 text-right">
                <p className="font-bold text-lg">Total: ₹{order.total}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
