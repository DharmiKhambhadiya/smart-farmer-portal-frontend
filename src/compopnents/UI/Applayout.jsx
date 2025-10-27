import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import Breadcrumbs from "./Breadcrumbs";

export const Applayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with proper z-index */}
      <Header />
      <breadcrumbs className=" pt-24 ">
        <Breadcrumbs />
      </breadcrumbs>

      {/* Main content with increased padding and z-index */}
      <main className="flex-1   z-10 relative">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
