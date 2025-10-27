import { RouterProvider, createBrowserRouter } from "react-router-dom";
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
import { Payment } from "./pages/payment";
import ProtectedRoute from "./compopnents/protectedroute";

//-------------------------Admin pages-------------------------//
import { Adminlayout } from "./compopnents/UI/Adminlayout/Adminlayout";
import { AdminUsers } from "./pages/Admin pages/Adminusers";
import { AdminProducts } from "./pages/Admin pages/Adminproduct";
import { AdminOrders } from "./pages/Admin pages/Adminorders";
import { AdminQueries } from "./pages/Admin pages/AdminQueries";
import { Dashboard } from "./pages/Admin pages/dashboard";
import { AdminCrops } from "./pages/Admin pages/Admincrops";
import { AdminHome } from "./pages/Admin pages/AdminHome";
import { PrivacyPolicy } from "./pages/PrivacyandPolicy";
import { TermsOfService } from "./pages/TermOfServices";

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
        { path: "/payment", element: <Payment /> },
        { path: "/privacy", element: <PrivacyPolicy /> },
        { path: "/services", element: <TermsOfService /> },
        {
          path: "/shipping",
          element: (
            <ProtectedRoute>
              <Ordershipping />
            </ProtectedRoute>
          ),
        },
      ],
    },
    //-------------------------Admin pages-------------------------//

    {
      path: "/admin",
      element: (
        <ProtectedRoute adminOnly>
          <Dashboard />
        </ProtectedRoute>
      ),
      children: [
        { path: "/admin", element: <AdminHome /> },
        { path: "/admin/users", element: <AdminUsers /> },
        { path: "/admin/crops", element: <AdminCrops /> },
        { path: "/admin/products", element: <AdminProducts /> },
        { path: "/admin/orders", element: <AdminOrders /> },
        { path: "/admin/queries", element: <AdminQueries /> },
      ],
    },
  ]);

  return <RouterProvider router={layout} />;
}

export default App;
