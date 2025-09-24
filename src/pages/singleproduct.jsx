import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../compopnents/services/API/productapi";
import { UseCartcontext } from "../compopnents/context/cartcontext";
import { useState } from "react";

export const Singleproduct = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["singleproduct", id],
    queryFn: () => getProduct(id),
  });
  const { AddToCart } = UseCartcontext();
  const [mainImage, setMainImage] = useState(null);

  const handleAddBtnClick = (product) => {
    try {
      AddToCart(product);
      toast.success("Product added to Cart");
    } catch (error) {
      console.log("error ", error);
      toast.error("Can't add to Cart");
    }
  };

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground text-lg">
          Loading product...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-destructive text-lg">Error loading product.</div>
      </div>
    );
  }

  const product = data?.data || data;
  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground text-lg">No product found.</div>
      </div>
    );
  }

  const images = product.images || [];
  // Set initial main image to the first image if not already set
  if (!mainImage && images.length > 0) {
    setMainImage(images[0]);
  }
  const otherImages = images.filter((img) => img !== mainImage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side - Images */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-[400px] object-contain rounded-lg border border-border shadow-sm"
            />
          ) : (
            <div className="w-full h-[400px] bg-muted flex items-center justify-center rounded-lg border border-border">
              <span className="text-muted-foreground">No Image Available</span>
            </div>
          )}
          {/* Thumbnail Images */}
          {images.length > 0 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-lg border ${
                    mainImage === img
                      ? "border-primary border-2"
                      : "border-border"
                  } cursor-pointer hover:scale-105 transition-transform duration-200`}
                  onClick={() => handleThumbnailClick(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Product Info */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <h1 className="text-3xl font-bold mb-4 text-foreground">
            {product.name}
          </h1>
          {product.subtitle && (
            <p className="text-muted-foreground italic mb-4">
              {product.subtitle}
            </p>
          )}
          <p className="text-foreground mb-6 leading-relaxed">
            {product.description}
          </p>
          <div className="space-y-3 text-foreground mb-6">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Stock:</span>
              {product.stock > 0 ? (
                <span className="text-primary font-medium">
                  {product.stock} left
                </span>
              ) : (
                <span className="text-destructive font-medium">
                  Out of Stock
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Category:</span>
              <span className="text-muted-foreground">
                {product.categories}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Brand:</span>
              <span className="text-muted-foreground">{product.brand}</span>
            </div>
            {product.madeIn && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">Made In:</span>
                <span className="text-muted-foreground">{product.madeIn}</span>
              </div>
            )}
          </div>
          <p className="text-3xl font-bold text-primary mb-6">
            ₹{product.price}
          </p>
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg shadow-sm transition-colors duration-200 font-medium"
              onClick={() => handleAddBtnClick(product)}
            >
              Add to Cart
            </button>
            {/* <button className="border border-border hover:bg-muted text-foreground px-6 py-3 rounded-lg shadow-sm transition-colors duration-200 font-medium">
              Buy Now
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};
