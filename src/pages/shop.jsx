import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../compopnents/services/API/productapi";
import { UseCartcontext } from "../compopnents/context/cartcontext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
    try {
      AddToCart(product);
      toast.success("Product added to Cart");
    } catch (error) {
      console.log("error ", error);
      toast.error("Can't add to Cart");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-12 text-center tracking-tight">
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
                  <p className="text-xs text-green-600 uppercase font-semibold tracking-wide mb-1">
                    {product.categories}
                  </p>
                  <h2 className="font-semibold text-lg text-gray-900 leading-snug line-clamp-2 hover:text-green-700 transition-colors">
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
                  className="mt-auto w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
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
  );
};
