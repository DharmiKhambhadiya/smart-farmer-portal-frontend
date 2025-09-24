import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  addCart,
  deleteCart,
  getCart,
  mergeCart,
  updateCart,
} from "../services/API/cartapi";

export const Cartcontext = createContext();

export const CartcontextProvider = ({ children }) => {
  const [cartitems, setcartitems] = useState(() => {
    const stored = localStorage.getItem("cartitems");
    return stored ? JSON.parse(stored) : [];
  });

  // Format API cart items to match frontend structure
  const formatCartItems = (cartResponse) => {
    const items = cartResponse?.data?.items || cartResponse?.items || [];
    return items.map((item) => ({
      productid: item.product?._id?.toString() || item.product.toString(),
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
    }));
  };

  // Sync cart on mount for logged-in users
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const syncCart = async () => {
        try {
          const res = await getCart();
          console.log("Sync cart response:", res);
          if (res?.data?.items || res?.items) {
            const formattedItems = formatCartItems(res);
            setcartitems(formattedItems);
            localStorage.setItem("cartitems", JSON.stringify(formattedItems));
          } else {
            console.warn("No items in cart response:", res);
            setcartitems([]);
            localStorage.setItem("cartitems", JSON.stringify([]));
          }
        } catch (err) {
          console.error(
            "Failed to sync cart on mount:",
            err.response?.data || err.message
          );
          // Ignore 404 handled upstream; only toast other errors
        }
      };
      syncCart();
    }
  }, []);

  // Add to cart
  const AddToCart = async (product) => {
    if (!product?._id) {
      console.error("Product ID missing:", product);
      toast.error("Invalid product data");
      return;
    }

    const token = localStorage.getItem("token");
    console.log("Adding to cart:", product._id, "Logged in:", !!token);

    if (token) {
      try {
        const res = await addCart(product._id, 1);
        console.log("API add success:", res);
        const formattedItems = formatCartItems(res);
        setcartitems(formattedItems);
        localStorage.setItem("cartitems", JSON.stringify(formattedItems));
        toast.success("Product added to Cart");
      } catch (error) {
        console.error(
          "API add to cart failed:",
          error.response?.data || error.message
        );
        toast.error("Failed to add to cart");
      }
    } else {
      const existingItem = cartitems.find(
        (item) => item.productid === product._id
      );
      let newCart;
      if (existingItem) {
        newCart = cartitems.map((item) =>
          item.productid === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
                totalPrice: (item.quantity + 1) * item.price,
              }
            : item
        );
      } else {
        newCart = [
          ...cartitems,
          {
            productid: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || "",
            quantity: 1,
            totalPrice: product.price,
          },
        ];
      }
      setcartitems(newCart);
      localStorage.setItem("cartitems", JSON.stringify(newCart));
      toast.success("Product added to Cart");
    }
  };

  // Increase quantity
  const increaseQuantity = async (productId) => {
    const item = cartitems.find((i) => i.productid === productId);
    if (!item) {
      console.error("Item not found for increase:", productId);
      return;
    }

    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await updateCart(productId, item.quantity + 1);
        console.log("Increase quantity response:", res);
        const formattedItems = formatCartItems(res);
        setcartitems(formattedItems);
        localStorage.setItem("cartitems", JSON.stringify(formattedItems));
        toast.success("Quantity increased");
      } catch (err) {
        console.error(
          "Failed to increase quantity:",
          err.response?.data || err.message
        );
        toast.error("Failed to update quantity");
      }
    } else {
      const updatedCart = cartitems.map((i) =>
        i.productid === productId
          ? {
              ...i,
              quantity: i.quantity + 1,
              totalPrice: (i.quantity + 1) * i.price,
            }
          : i
      );
      setcartitems(updatedCart);
      localStorage.setItem("cartitems", JSON.stringify(updatedCart));
      toast.success("Quantity increased");
    }
  };

  // Decrease quantity
  const decreaseQuantity = async (productId) => {
    const item = cartitems.find((i) => i.productid === productId);
    if (!item || item.quantity <= 1) {
      if (item?.quantity <= 1) {
        await RemoveFromCart(productId);
      }
      return;
    }

    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await updateCart(productId, item.quantity - 1);
        console.log("Decrease quantity response:", res);
        const formattedItems = formatCartItems(res);
        setcartitems(formattedItems);
        localStorage.setItem("cartitems", JSON.stringify(formattedItems));
        toast.success("Quantity decreased");
      } catch (err) {
        console.error(
          "Failed to decrease quantity:",
          err.response?.data || err.message
        );
        toast.error("Failed to update quantity");
      }
    } else {
      const updatedCart = cartitems.map((i) =>
        i.productid === productId
          ? {
              ...i,
              quantity: i.quantity - 1,
              totalPrice: (i.quantity - 1) * i.price,
            }
          : i
      );
      setcartitems(updatedCart);
      localStorage.setItem("cartitems", JSON.stringify(updatedCart));
      toast.success("Quantity decreased");
    }
  };

  // Remove from cart
  const RemoveFromCart = async (productId) => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await deleteCart(productId);
        console.log("Remove cart response:", res);
        const formattedItems = formatCartItems(res);
        setcartitems(formattedItems);
        localStorage.setItem("cartitems", JSON.stringify(formattedItems));
        toast.success("Item removed from cart");
      } catch (err) {
        console.error(
          "Remove from cart failed:",
          err.response?.data || err.message
        );
        toast.error("Failed to remove item");
      }
    } else {
      const updatedCart = cartitems.filter(
        (item) => item.productid !== productId
      );
      setcartitems(updatedCart);
      localStorage.setItem("cartitems", JSON.stringify(updatedCart));
      toast.success("Item removed from cart");
    }
  };

  // Merge cart
  const MergeCart = async () => {
    const token = localStorage.getItem("token");
    if (!token || cartitems.length === 0) {
      console.warn("MergeCart skipped: No token or empty cart");
      return;
    }

    try {
      const formattedItems = cartitems.map((item) => ({
        productId: item.productid,
        quantity: item.quantity,
      }));
      console.log("Merging cart with items:", formattedItems);
      const res = await mergeCart(formattedItems);
      console.log("Merge cart response:", res);
      const formattedItemsMerged = formatCartItems(res);
      setcartitems(formattedItemsMerged);
      localStorage.removeItem("cartitems");
      toast.success("Cart merged successfully");
    } catch (err) {
      console.error("Cart merge failed:", err.response?.data || err.message);
      toast.error("Failed to merge cart");
    }
  };

  // Clear cart
  const ClearCart = () => {
    setcartitems([]);
    localStorage.removeItem("cartitems");
    toast.success("Cart cleared");
  };

  return (
    <Cartcontext.Provider
      value={{
        cartitems,
        AddToCart,
        RemoveFromCart,
        ClearCart,
        MergeCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </Cartcontext.Provider>
  );
};

export const UseCartcontext = () => {
  const context = useContext(Cartcontext);
  if (!context) {
    throw new Error("UseCartcontext must be used within CartcontextProvider");
  }
  return context;
};

export default CartcontextProvider;
