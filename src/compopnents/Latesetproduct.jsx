import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLatestproduct } from "./services/API/productapi";
import toast from "react-hot-toast";

export const LatestProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getLatestproduct();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load latest products");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <svg
          className="animate-spin h-8 w-8 text-green-500 mx-auto"
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
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Latest Products
      </h2>
      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductClick(product._id)}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer relative"
            >
              {/* Best Seller Badge */}
              {product.bestSeller && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Best Seller
                </span>
              )}
              <img
                src={product.images[0] || "/images/placeholder.jpg"}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  {product.subtitle}
                </p>
                <p className="text-lg font-bold text-green-600 mt-2">
                  ₹{product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
