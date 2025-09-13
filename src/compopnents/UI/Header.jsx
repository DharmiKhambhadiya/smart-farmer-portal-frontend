import { NavLink, useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { MdLogin } from "react-icons/md";
import { RiAccountCircle2Line } from "react-icons/ri";
// import logo from "../assets/417377e7-4a6e-4440-89fa-8ae5f8c915ba.png"; // adjust path if needed

export const Header = () => {
  const navigate = useNavigate();
  const handlecart = () => {
    navigate("/cart");
  };
  return (
    <header className="bg-[#5D4037] text-white px-6 py-4 shadow-md">
      <nav className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <img src="/images/logo.png" alt="Smart Farmer Logo" className="w-10 h-10 object-contain" />
          <span className="text-xl font-bold">Smart Farmer</span>
        </div>

        <div className="flex gap-6 items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "font-semibold underline" : "hover:underline"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "font-semibold underline" : "hover:underline"
            }
          >
            Guide
          </NavLink>
          <NavLink
            to="/account"
            className={({ isActive }) =>
              isActive ? "font-semibold underline" : "hover:underline"
            }
          >
            Account
          </NavLink>
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              isActive ? "font-semibold underline" : "hover:underline"
            }
          >
            Shop
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "font-semibold underline" : "hover:underline"
            }
          >
            Contact
          </NavLink>
          <div
            onClick={() => window.open("https://blog-nest-eta.vercel.app/")}
            className="cursor-pointer hover:underline"
          >
            Blog
          </div>

          <div className="cursor-pointer hover:underline" onClick={handlecart}>
            <FiShoppingCart />
          </div>
          <NavLink
            to="/signup"
            className={({ isActive }) =>
              isActive ? "font-semibold underline" : "hover:underline"
            }
          >
            <RiAccountCircle2Line />
          </NavLink>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? "font-semibold underline" : "hover:underline"
            }
          >
            <MdLogin />
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
