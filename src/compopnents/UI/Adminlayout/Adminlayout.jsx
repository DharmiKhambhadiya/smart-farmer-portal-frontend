import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./footer";
import { Breadcrumbs } from "../../UI/Breadcrumbs";

export const Adminlayout = () => {
  return (
    <>
      <Header />
      <Breadcrumbs />
      <Outlet />
      <Footer />
    </>
  );
};
