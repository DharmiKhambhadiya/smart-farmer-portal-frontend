import { useNavigate } from "react-router-dom";
import { UseCartcontext } from "../compopnents/context/cartcontext"; // Fixed path
import toast from "react-hot-toast"; // Add for feedback

export const Cart = () => {
  const { cartitems, RemoveFromCart, increaseQuantity, decreaseQuantity } =
    UseCartcontext();

  const navigate = useNavigate();
  const handleaddbtn = (productId) => {
    increaseQuantity(productId);
    toast.success("Quantity increased");
  };

  const handleremovebtn = (productId) => {
    decreaseQuantity(productId); // This now handles remove if qty=1 via context
  };

  const handleprocessbtn = () => {
    if (cartitems.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    navigate("/shipping");
  };

  const handleRemove = (productId) => {
    RemoveFromCart(productId);
  };

  // ... rest of your JSX remains the same, but update the remove button:
  // <button onClick={() => handleRemove(item.productid)}>Remove</button>

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🛒 Your Cart</h1>

      {cartitems.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-md text-center">
          <p className="text-gray-600 text-lg">Your cart is empty</p>
          <button
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
            onClick={() => navigate("/shop")}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {cartitems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-5 flex flex-col md:flex-row gap-6 items-center"
            >
              {/* Product Image */}
              <div className="w-28 h-28 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-grow w-full">
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h2>

                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold"
                      onClick={() => handleaddbtn(item.productid)}
                    >
                      +
                    </button>
                    <span className="px-2 font-medium">{item.quantity}</span>
                    <button
                      className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold"
                      onClick={() => handleremovebtn(item.productid)}
                    >
                      -
                    </button>
                  </div>
                </div>

                {/* Price Info */}
                <div className="mt-3 flex items-center gap-4">
                  <span className="text-xl font-bold text-green-600">
                    ₹{item.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    Total: ₹{item.totalPrice || item.price * item.quantity}
                  </span>
                </div>
              </div>

              {/* Remove Button */}
              <button
                className="text-red-500 hover:text-red-600 font-medium self-end md:self-auto"
                onClick={() => handleRemove(item.productid)}
              >
                Remove
              </button>
            </div>
          ))}

          {/* Cart Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-lg mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-xl font-semibold text-gray-800">
              Subtotal
            </span>
            <span className="text-2xl font-bold text-green-700">
              ₹
              {cartitems.reduce(
                (acc, item) =>
                  acc + (item.totalPrice || item.price * item.quantity),
                0
              )}
            </span>
          </div>

          {/* Checkout Button */}
          <div className="flex justify-end mt-6">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition"
              onClick={handleprocessbtn}
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
