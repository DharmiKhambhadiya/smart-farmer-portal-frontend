import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../compopnents/services/API/productapi";
import { UseCartcontext } from "../compopnents/context/cartcontext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { StaticCloud } from "../compopnents/iconcloud/staticcloud";

export const Shop = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const navigate = useNavigate();
  const { AddToCart } = UseCartcontext();

  const handleonclick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleaddbtnclick = (product) => {
    const loadingToast = toast.loading("Adding to cart...");
    try {
      AddToCart(product);
      toast.dismiss(loadingToast);
      toast.success("✅ Product added to Cart", { duration: 3000 });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.dismiss(loadingToast);
      toast.error(`❌ Cart: ${error.message || "Can't add to Cart"}`, {
        duration: 5000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-8 w-8 text-emerald-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
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
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    toast.error("❌ Products: Failed to load products", { duration: 5000 });
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">
          Error loading products. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section with StaticCloud */}
        <section className="relative w-full h-[350px] mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-emerald-50 to-emerald-100 flex flex-row items-center justify-between px-8 py-10 rounded-xl overflow-hidden shadow-lg">
            {/* Left: Text */}
            <div className="flex-1 text-emerald-900 z-10 pr-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Grow Smarter with Smart Farmer
              </h1>
              <p className="text-lg mb-6">
                Discover premium farming tools and resources for a thriving
                harvest.
              </p>
              {/* <button
                className="bg-emerald-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-emerald-700 transition-colors"
                onClick={() => navigate("/shop")}
              >
                Explore More
              </button> */}
            </div>
            {/* Right: Cloud */}
            <div className="flex-1 flex justify-end items-center h-full overflow-hidden">
              <div className="w-full max-w-[320px] md:max-w-[400px] h-[220px] md:h-[300px] flex items-center justify-center">
                <StaticCloud />
              </div>
            </div>
          </div>
        </section>

        {/* Main Shop Content */}
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center tracking-tight">
            Shop Products
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {data?.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
              >
                <div
                  className="h-56 flex items-center justify-center bg-gray-100 cursor-pointer relative overflow-hidden"
                  onClick={() => handleonclick(product._id)}
                >
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-contain p-4 transform transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="text-gray-400 text-sm">No Image</div>
                  )}
                </div>
                <div className="flex flex-col p-5 flex-grow">
                  <div
                    onClick={() => handleonclick(product._id)}
                    className="cursor-pointer"
                  >
                    <p className="text-xs text-emerald-600 uppercase font-semibold tracking-wide mb-1">
                      {product.categories}
                    </p>
                    <h2 className="font-semibold text-lg text-gray-900 leading-snug line-clamp-2 hover:text-emerald-700 transition-colors">
                      {product.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Brand:{" "}
                      <span className="text-gray-900 font-medium">
                        {product.brand}
                      </span>
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-xl font-bold text-gray-900">
                        ₹{product.price}
                      </span>
                      {product.oldPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{product.oldPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    className="mt-auto w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
                    onClick={() => handleaddbtnclick(product)}
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
