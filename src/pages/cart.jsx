import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import DataTable from "react-data-table-component";
import { UseCartcontext } from "../compopnents/context/cartcontext";
import toast from "react-hot-toast";
import Breadcrumbs from "../compopnents/UI/Breadcrumbs";

export const Cart = () => {
  const { cartitems, RemoveFromCart, increaseQuantity, decreaseQuantity } =
    UseCartcontext();
  const navigate = useNavigate();
  {
    /* ✅ Breadcrumbs */
  }
  <Breadcrumbs
    paths={[
      { label: "Home", href: "/" },
      { label: "Shop", href: "/shop" },
      { label: "Cart", href: "/cart" },
    ]}
  />;

  const columns = [
    {
      name: "Image",
      cell: (row) => (
        <div className="w-16 h-16">
          {row.image ? (
            <img
              src={row.image}
              alt={row.name}
              className="w-full h-full object-contain rounded"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Image
            </div>
          )}
        </div>
      ),
      width: "100px",
    },
    {
      name: "Product",
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Price",
      selector: (row) => `₹${row.price}`,
      sortable: true,
    },
    {
      name: "Quantity",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            onClick={() => {
              if (row.quantity > 1) {
                decreaseQuantity(row.productid);
              } else {
                RemoveFromCart(row.productid);
              }
            }}
          >
            -
          </button>

          <input
            type="number"
            min="1"
            value={row.quantity} // 🔥 controlled value
            onChange={(e) => {
              const newQty = parseInt(e.target.value);
              if (!isNaN(newQty) && newQty >= 1) {
                // optional: update directly if you want live change
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const newQty = parseInt(e.target.value);

                if (!isNaN(newQty)) {
                  if (newQty > row.quantity) {
                    for (let i = row.quantity; i < newQty; i++) {
                      increaseQuantity(row.productid);
                    }
                  } else if (newQty < row.quantity && newQty >= 1) {
                    for (let i = row.quantity; i > newQty; i--) {
                      decreaseQuantity(row.productid);
                    }
                  } else if (newQty < 1) {
                    RemoveFromCart(row.productid);
                  }
                }
              }
            }}
            className="w-12 text-center border rounded"
          />

          <button
            type="button"
            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            onClick={() => increaseQuantity(row.productid)}
          >
            +
          </button>
        </div>
      ),
      width: "200px",
    },

    {
      name: "Total",
      selector: (row) => `₹${row.totalPrice}`,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          className="text-red-500 hover:text-red-600 font-medium"
          onClick={() => RemoveFromCart(row.productid)}
        >
          Remove
        </button>
      ),
    },
  ];

  const handleCheckout = () => {
    if (cartitems.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    navigate("/shipping");
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800"> Your Cart</h1>
      {cartitems.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-md text-center">
          <p className="text-gray-600 text-lg">Your cart is empty</p>
          <button
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            onClick={() => navigate("/shop")}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <DataTable
            columns={columns}
            data={cartitems}
            pagination
            highlightOnHover
            striped
            customStyles={{
              rows: {
                style: {
                  minHeight: "72px",
                  backgroundColor: "#fff",
                },
              },
              headCells: {
                style: {
                  fontSize: "16px",
                  fontWeight: "bold",
                  backgroundColor: "#f1f5f9",
                },
              },
            }}
          />
          <div className="bg-white p-6 rounded-2xl shadow-lg mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-xl font-semibold text-gray-800">
              Subtotal
            </span>
            <span className="text-2xl font-bold text-green-700">
              ₹{cartitems.reduce((acc, item) => acc + item.totalPrice, 0)}
            </span>
          </div>
          <div className="flex justify-end mt-6">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition"
              onClick={handleCheckout}
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
