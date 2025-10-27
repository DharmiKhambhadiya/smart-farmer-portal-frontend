import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import CartcontextProvider from "./compopnents/context/cartcontext.jsx";
import { AuthProvider } from "./compopnents/context/authcontext.jsx";
import { UserProvider } from "./compopnents/context/Usercontext.jsx";

const queryclient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryclient}>
    <CartcontextProvider>
      <UserProvider>
        <AuthProvider>
          <App />
          <Toaster />
        </AuthProvider>
      </UserProvider>
    </CartcontextProvider>
  </QueryClientProvider>
);
