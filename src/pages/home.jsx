import { UseCartcontext } from "../compopnents/context/cartcontext";
import { Slider } from "../compopnents/slider";
import toast from "react-hot-toast";

export const Home = () => {
  const { ClearCart } = UseCartcontext();
  const handleLogout = () => {
    localStorage.removeItem("token");
    ClearCart();
    toast.success("logout");
  };
  return (
    <>
      <Slider />
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </>
  );
};
