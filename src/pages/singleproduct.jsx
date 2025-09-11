import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../compopnents/services/API/productapi";

export const Singleproduct = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["singleproduct", id],
    queryFn: () => getProduct(id),
  });

  if (isLoading)
    return <div className="text-center py-10">Loading product...</div>;
  if (isError)
    return (
      <div className="text-center text-red-500">Error loading product.</div>
    );

  const product = data?.data || data;
  if (!product) return <div className="text-center">No product found.</div>;

  const images = product.images || [];
  const mainImage = images[0] || null;
  const otherImages = images.slice(1);

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* ✅ Left Side - Images */}
      <div>
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-[400px] object-contain rounded-lg border shadow"
          />
        ) : (
          <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center rounded-lg">
            <span>No Image Available</span>
          </div>
        )}

        {/* Thumbnail Images */}
        {otherImages.length > 0 && (
          <div className="flex gap-3 mt-4">
            {otherImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} ${index + 1}`}
                className="w-20 h-20 object-cover rounded-lg border cursor-pointer hover:scale-105 transition"
              />
            ))}
          </div>
        )}
      </div>

      {/* ✅ Right Side - Product Info */}
      <div>
        <h2 className="text-3xl font-bold mb-2">{product.name}</h2>

        {product.subtitle && (
          <p className="text-gray-500 italic mb-2">{product.subtitle}</p>
        )}

        <p className="text-gray-700 mb-4">{product.description}</p>

        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-semibold">Stock:</span>{" "}
            {product.stock > 0 ? (
              <span className="text-green-600">{product.stock} left</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </p>
          <p>
            <span className="font-semibold">Category:</span>{" "}
            {product.categories}
          </p>
          <p>
            <span className="font-semibold">Brand:</span> {product.brand}
          </p>
          {product.madeIn && (
            <p>
              <span className="font-semibold">Made In:</span> {product.madeIn}
            </p>
          )}
        </div>

        <p className="text-2xl font-semibold text-green-600 mt-4">
          ₹{product.price}
        </p>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow">
            Add to Cart
          </button>
          <button className="border border-gray-400 hover:bg-gray-100 px-6 py-2 rounded-lg shadow">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};
