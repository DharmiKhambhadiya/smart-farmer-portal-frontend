import { NavLink, useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { RiAccountCircle2Line } from "react-icons/ri";
import { useState } from "react";
import { UseCartcontext } from "../context/cartcontext";

export const Header = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { cartitems } = UseCartcontext();
  const isLoggedIn = !!localStorage.getItem("token");

  const handlecart = () => navigate("/cart");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    setIsDropdownOpen(false);
  };
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-primary via-primary-dark to-primary-darker text-black px-6 py-4 shadow-elegant backdrop-blur-sm border-b border-primary-light/20">
      <nav className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group transition-all duration-300 hover:scale-105"
          onClick={() => navigate("/")}
        >
          <img
            src="/images/logo.png"
            alt="Smart Farmer Logo"
            className="w-12 h-12 object-contain rounded-full shadow-glow transition-all duration-300 group-hover:shadow-accent/50"
          />
          {/* <span className="text-2xl font-bold text-black">SMART FARMER</span> */}
        </div>

        {/* Navigation */}
        <div className="flex gap-8 items-center">
          {["/", "/about", "/shop", "/contact"].map((path, i) => {
            const labels = ["Home", "Guide", "Shop", "Contact"];
            return (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  isActive
                    ? "font-semibold text-accent border-b-2 border-accent pb-1"
                    : "text-black hover:text-accent transition-all duration-300"
                }
              >
                {labels[i]}
              </NavLink>
            );
          })}

          {/* Blog Link */}
          {/* <div
            onClick={() => window.open("https://blog-nest-eta.vercel.app/")}
            className="cursor-pointer text-black hover:text-accent transition-all duration-300"
          >
            Blog
          </div> */}

          {/* Action Icons */}
          <div className="flex items-center gap-4 ml-4 border-l border-primary-light/30 pl-4">
            {/* Cart Icon with Count */}
            <button
              onClick={handlecart}
              className="relative p-2 rounded-full bg-primary-light/20 hover:bg-accent/20 transition-all duration-300"
              aria-label="Shopping Cart"
            >
              <FiShoppingCart className="w-5 h-5 text-black" />
              {cartitems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartitems.length}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="p-2 rounded-full bg-primary-light/20 hover:bg-accent/20 transition-all duration-300"
                aria-label="Profile Menu"
              >
                <RiAccountCircle2Line className="w-5 h-5 text-black" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-100 z-50">
                  <div className="py-2">
                    {isLoggedIn ? (
                      <>
                        <NavLink
                          to="/account"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Account
                        </NavLink>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <NavLink
                          to="/signup"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Sign Up
                        </NavLink>
                        <NavLink
                          to="/login"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Login
                        </NavLink>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
