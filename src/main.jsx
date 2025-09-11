import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Optional, only if you need Bootstrap's JS (modals, dropdowns, etc.)
import CartcontextProvider from "./compopnents/context/cartcontext.jsx";

const queryclient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryclient}>
    <CartcontextProvider>
      <App />
    </CartcontextProvider>
  </QueryClientProvider>
);
