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

  // Helper to format API cart items
  const formatCartItems = (cartData) => {
    // cartData is now { items: [...], subtotal: ... }
    return (cartData.items || []).map((item) => ({
      productid: item.product._id || item.product.toString(),
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
    }));
  };

  // Load cart from API on mount if logged in (sync local with DB)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const syncCart = async () => {
        try {
          const res = await getCart();
          if (res?.items) {
            setcartitems(formatCartItems(res.items));
            localStorage.setItem(
              "cartitems",
              JSON.stringify(formatCartItems(res.items))
            );
          }
        } catch (err) {
          console.error("Failed to sync cart on mount:", err);
        }
      };
      syncCart();
    }
  }, []);

  // -----------------------------Add to cart---------------------------
  const AddToCart = async (product) => {
    if (!product?._id) {
      console.error("Product ID missing:", product);
      toast.error("Invalid product data");
      return;
    }

    const token = localStorage.getItem("token");
    console.log("Adding to cart:", product._id, "Logged in:", !!token); // Debug log

    if (token) {
      try {
        const updatedCart = await addCart(product._id, 1);
        console.log("API add success:", updatedCart);
        setcartitems(formatCartItems(updatedCart.data || updatedCart)); // Handle both structures
        toast.success("Product added to Cart");
      } catch (error) {
        console.error("API add to cart failed:", error);
        toast.error("Failed to add to cart");
      }
    } else {
      // Guest → Save to localStorage
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

      // Optional: Prepare for merge when user logs in
      console.log("Local cart updated:", newCart);
    }
  };

  //------------------------ Increase quantity---------------------------
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
        setcartitems(formatCartItems(res.items));
        localStorage.setItem(
          "cartitems",
          JSON.stringify(formatCartItems(res.items))
        );
      } catch (err) {
        console.error("Failed to increase quantity:", err);
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
    }
  };

  //---------------------- Decrease quantity--------------------
  const decreaseQuantity = async (productId) => {
    const item = cartitems.find((i) => i.productid === productId);
    if (!item || item.quantity <= 1) {
      if (item?.quantity <= 1) RemoveFromCart(productId); // Auto-remove if qty=1
      return;
    }

    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await updateCart(productId, item.quantity - 1);
        setcartitems(formatCartItems(res.items));
        localStorage.setItem(
          "cartitems",
          JSON.stringify(formatCartItems(res.items))
        );
      } catch (err) {
        console.error("Failed to decrease quantity:", err);
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
    }
  };

  //--------------------------------- Remove from cart-------------------------
  const RemoveFromCart = async (productId) => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await deleteCart(productId);
        if (res?.items) {
          setcartitems(formatCartItems(res.items));
          localStorage.setItem(
            "cartitems",
            JSON.stringify(formatCartItems(res.items))
          );
        }
        toast.success("Item removed from cart");
      } catch (err) {
        console.error("Remove from cart failed:", err);
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

  //-------------------------------- Merge cart-------------------------------
  const MergeCart = async () => {
    const token = localStorage.getItem("token");
    if (!token || cartitems.length === 0) return;

    try {
      const formattedItems = cartitems.map((item) => ({
        productId: item.productid,
        quantity: item.quantity,
      }));
      const res = await mergeCart(formattedItems);
      if (res?.items) {
        setcartitems(formatCartItems(res.items));
        localStorage.removeItem("cartitems");
        toast.success("Cart merged successfully");
      }
    } catch (err) {
      console.error("Cart merge failed:", err);
      toast.error("Failed to merge cart");
    }
  };

  // -------------------------------Clear cart----------------------------
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
