import { Outlet } from "react-router-dom";
import { Breadcrumbs } from "./Breadcrumbs";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

export const UserLayout = () => {
  const location = useLocation();

  // Define custom breadcrumbs for specific user routes
  const customCrumbs = useMemo(() => {
    const path = location.pathname;

    // Account Dashboard
    if (path === "/account") {
      return [
        { label: "Home", href: "/" },
        { label: "Account", href: "/account", isActive: true },
      ];
    }

    // Shipping Page
    if (path === "/shipping") {
      return [
        { label: "Home", href: "/" },
        { label: "Cart", href: "/cart" },
        { label: "Shipping", isActive: true },
      ];
    }

    // Order Details (if you add this route later)
    if (path.includes("/account/orders/")) {
      const orderId = path.split("/").pop();
      return [
        { label: "Home", href: "/" },
        { label: "Account", href: "/account" },
        { label: "Orders", href: "/account/orders" },
        { label: `Order #${orderId}`, isActive: true },
      ];
    }

    // Profile Page (if you add this)
    if (path === "/account/profile") {
      return [
        { label: "Home", href: "/" },
        { label: "Account", href: "/account" },
        { label: "Profile", isActive: true },
      ];
    }

    return []; // Use auto-generated breadcrumbs
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs - Only show on user pages */}
      {(location.pathname.includes("/account") ||
        location.pathname === "/shipping") && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Breadcrumbs customCrumbs={customCrumbs} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
