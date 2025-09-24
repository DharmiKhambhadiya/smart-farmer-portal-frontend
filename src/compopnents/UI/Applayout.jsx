import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Breadcrumbs } from "./Breadcrumbs";
import { Footer } from "./Footer";

export const Applayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with proper z-index */}
      <Header />

      {/* Breadcrumbs */}
      <div className="pt-24 md:pt-28">
        <Breadcrumbs />
      </div>

      {/* Main content with increased padding and z-index */}
      <main className="flex-1 z-10 relative">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
