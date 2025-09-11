import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { Applayout } from "./compopnents/UI/Applayout";
import { Home } from "./pages/home";
import { About } from "./pages/about";
import { Shop } from "./pages/shop";
import { Contact } from "./pages/contact";
import { Signup } from "./pages/signup";
import { Login } from "./pages/login";
import { VerifyOTP } from "./pages/verify-otp";
import { Singleproduct } from "./pages/singleproduct";
import { Singlecrop } from "./pages/singlecrop";
import { Cart } from "./pages/cart";
import { ChangePassword } from "./pages/changepass";
import { ResetPasswordPage } from "./compopnents/ResetLink";
import { Account } from "./pages/account";
import { Ordershipping } from "./pages/Ordershipping";

function App() {
  const layout = createBrowserRouter([
    {
      path: "/",
      element: <Applayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/about", element: <About /> },
        { path: "/about/:id", element: <Singlecrop /> },

        { path: "/shop", element: <Shop /> },
        { path: "/product/:id", element: <Singleproduct /> },
        { path: "/contact", element: <Contact /> },
        { path: "/cart", element: <Cart /> },
        { path: "/signup", element: <Signup /> },
        { path: "/verify-otp", element: <VerifyOTP /> },
        { path: "/login", element: <Login /> },
        { path: "/changepassword", element: <ChangePassword /> },
        { path: "/reset-password/:token", element: <ResetPasswordPage /> },
        { path: "/account", element: <Account /> },
        { path: "/shipping", element: <Ordershipping /> },
      ],
    },
  ]);

  return (
    <>
      <Toaster />
      <RouterProvider router={layout} />
    </>
  );
}

export default App;
