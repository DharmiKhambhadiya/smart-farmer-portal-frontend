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

  // Toast feedback
  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch orders. Please try again.");
    }
    if (!isLoading && orders.length === 0) {
      toast.info("You haven't placed any orders yet.");
    }
  }, [isError, isLoading, orders.length]);

  // Skeleton Loader Component
  const SkeletonOrderItem = () => (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="flex gap-4 mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="w-20 h-4 bg-gray-200 rounded"></div>
      </div>
      <div className="h-5 bg-gray-200 rounded w-1/3 mt-4"></div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
              >
                <SkeletonOrderItem />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-500"
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
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Couldn’t Load Orders
          </h3>
          <p className="text-gray-600 mb-6">
            There was an issue fetching your order history. Please check your
            connection or try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l2 5H3L5 9z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            No Orders Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Your order history will appear here once you make your first
            purchase.
          </p>
          <a
            href="/shop"
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-[1.02] shadow-md"
          >
            Browse Crops
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-green-200 rounded-full opacity-30 blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-200 rounded-full opacity-30 blur-xl"></div>

      <div className="max-w-4xl mx-auto z-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          My Orders
        </h2>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Header: Status + Order Info */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : order.status === "confirmed"
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : order.status === "processing"
                        ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        : order.status === "cancelled"
                        ? "bg-red-100 text-red-800 border border-red-200"
                        : "bg-gray-100 text-gray-800 border border-gray-200"
                    }`}
                  >
                    {order.status === "delivered" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    {order.status === "confirmed" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    )}
                    {order.status === "processing" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    )}
                    {order.status === "cancelled" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    Order #{order.orderId || order._id.slice(-6)} •{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg text-gray-800">
                    ₹{order.total.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4 mb-6">
                {order.orderitems?.length > 0 ? (
                  order.orderitems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <img
                        src={
                          item.image ||
                          "https://via.placeholder.com/100x100?text=No+Image"
                        }
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg shadow-sm"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/100x100?text=No+Image";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right font-semibold text-gray-800">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No items in this order
                  </p>
                )}
              </div>

              {/* Action Button (Optional: View Details / Reorder) */}
              {/* <div className="flex justify-end">
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm underline transition-colors">
                  View Details
                </button>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
