import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Getprofile } from "../services/API/userapi";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [hasToken, setHasToken] = useState(!!localStorage.getItem("token"));

  // Update hasToken when localStorage changes
  useEffect(() => {
    const checkToken = () => {
      setHasToken(!!localStorage.getItem("token"));
    };
    checkToken(); // Initial check
    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: Getprofile,
    enabled: hasToken, // Only run query if token exists
    retry: (failureCount, error) => {
      // Don't retry on 401 or "No authentication token found"
      if (
        error.response?.status === 401 ||
        error.message === "No authentication token found"
      ) {
        return false;
      }
      return failureCount < 2; // Retry up to 2 times for other errors
    },
  });

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    city: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    },
  });

  useEffect(() => {
    if (user) {
      console.log("User data fetched:", {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }); // Sanitized log
      setUserData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        city: user.city || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          pincode: user.address?.pincode || "",
          country: user.address?.country || "",
        },
      });
    }
    if (error) {
      console.error("Error fetching user profile:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      if (
        error.response?.status === 401 ||
        error.message === "No authentication token found"
      ) {
        localStorage.removeItem("token");
        setHasToken(false);
      }
    }
  }, [user, error]);

  return (
    <UserContext.Provider value={{ userData, setUserData, isLoading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
