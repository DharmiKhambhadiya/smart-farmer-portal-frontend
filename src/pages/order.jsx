import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Createorder, getOrder } from "../components/services/API/orderapi";

export const Order = () => {
  const navigate = useNavigate();

  const { mutate, isError, isLoading, error, isSuccess } = useMutation({
    mutationFn: Createorder,
    onSuccess: (data) => {
      console.log("Order created successfully", data);
      navigate("/ordersuccess");
    },
    onError: (error) => {
      console.error(error?.response?.data || error.message);
    },
  });

  const placeOrder = () => {
    const orderPayload = {
      user: "userIdHere",
      shippingdetails: {
        firstName: "John",
        lastName: "Doe",
        city: "Ahmedabad",
        phoneNumber: "9876543210",
        address: {
          street: "MG Road",
          state: "Gujarat",
          pincode: "380001",
        },
      },
      subtotal: 500,
      shippingcharges: 50,
      total: 550,
      orderitems: [
        {
          product: "productIdHere",
          name: "Product 1",
          price: 250,
          quantity: 2,
          image: "https://link.com/img.jpg",
        },
      ],
    };

    const { data, isError, error } = useQuery({
      queryKey: ["order"],
      queryFn: () => getOrder(),
    });

    mutate(orderPayload);
  };

  return (
    <div>
      <h1>Order Page</h1>
      <button onClick={placeOrder} disabled={isLoading}>
        {isLoading ? "Placing..." : "Place Order"}
      </button>
      {isError && <p className="text-red-500">Error: {error.message}</p>}
      {isSuccess && (
        <p className="text-green-500">Order placed successfully!</p>
      )}
    </div>
  );
};
