import { MdLocationPin } from "react-icons/md";
import { FaYoutube, FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const Footer = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  return (
    <footer className="bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 text-white px-6 py-8 border-t border-emerald-700/50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Contact Info with Logo */}
        <div className="space-y-4">
          <div
            className="flex items-center gap-3 cursor-pointer group transition-all duration-300 hover:scale-105"
            onClick={() => navigate("/")}
          >
            <img
              src="/images/logo.png"
              alt="Smart Farmer Logo"
              className="w-12 h-12 object-contain rounded-full shadow-glow transition-all duration-300 group-hover:shadow-emerald-400/50"
            />
            <span className="text-2xl font-bold">SMART FARMER</span>
          </div>

          <div className="space-y-3 text-emerald-100">
            <p className="flex items-start gap-3 group">
              <MdLocationPin className="text-emerald-300 w-6 h-6 mt-0.5 group-hover:scale-110 transition-all duration-300" />
              <span className="group-hover:text-emerald-200 transition-all duration-300">
                312E, Unknown Street, Undefined Road, Botad, Gujarat, India
              </span>
            </p>
            <p className="hover:text-emerald-200 transition-all duration-300">
              Call Us:{" "}
              <span className="text-emerald-300 font-semibold">
                +91 9876543211
              </span>
            </p>
            <p className="hover:text-emerald-200 transition-all duration-300">
              Email:{" "}
              <span className="text-emerald-300 font-semibold">
                sfp2005@sfp.com
              </span>
            </p>
          </div>
        </div>

        {/* Company Info */}
        <div>
          <h4 className="text-xl font-semibold text-emerald-300 mb-4 border-b border-emerald-400/30 pb-2">
            Company
          </h4>
          <ul className="space-y-2">
            <NavLink
              to="/about"
              className="block text-white hover:text-emerald-200 transition-all duration-300 hover:translate-x-2"
            >
              About Us
            </NavLink>
            <NavLink
              to="/shop"
              className="block text-white hover:text-emerald-200 transition-all duration-300 hover:translate-x-2"
            >
              Buy Products
            </NavLink>
            <NavLink
              to="/privacy"
              className="block text-white hover:text-emerald-200 transition-all duration-300 hover:translate-x-2"
            >
              Privacy and Policy
            </NavLink>
            <NavLink
              to="/services"
              className="block text-white hover:text-emerald-200 transition-all duration-300 hover:translate-x-2"
            >
              Terms Of Services
            </NavLink>
          </ul>
        </div>

        {/* Account Info */}
        <div>
          <h4 className="text-xl font-semibold text-emerald-300 mb-4 border-b border-emerald-400/30 pb-2">
            Account
          </h4>
          <ul className="space-y-2">
            {isLoggedIn ? (
              <NavLink
                to="/account"
                className="block text-white hover:text-emerald-200 transition-all duration-300 hover:translate-x-2"
              >
                Profile
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                className="block text-white  hover:text-emerald-200 transition-all duration-300 hover:translate-x-2"
              >
                Sign In
              </NavLink>
            )}
            <NavLink
              to="/cart"
              className="block text-white hover:text-emerald-200 transition-all duration-300 hover:translate-x-2"
            >
              View Cart
            </NavLink>
          </ul>
        </div>

        {/* Social Icons */}
        <div>
          <h4 className="text-xl font-semibold text-emerald-300 mb-4 border-b border-emerald-400/30 pb-2">
            Follow Us
          </h4>
          <div className="flex space-x-4 text-2xl">
            <NavLink
              to="https://www.facebook.com/smartfarmer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-emerald-200 hover:scale-125 transition-all duration-300 cursor-pointer p-2 rounded-full hover:bg-emerald-700/30 w-10 h-10 flex items-center justify-center"
            >
              <FaFacebook />
            </NavLink>
            <NavLink
              to="https://www.instagram.com/smartfarmer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-emerald-200 hover:scale-125 transition-all duration-300 cursor-pointer p-2 rounded-full hover:bg-emerald-700/30 w-10 h-10 flex items-center justify-center"
            >
              <FaInstagram />
            </NavLink>
            <NavLink
              to="https://www.twitter.com/smartfarmer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-emerald-200 hover:scale-125 transition-all duration-300 cursor-pointer p-2 rounded-full hover:bg-emerald-700/30 w-10 h-10 flex items-center justify-center"
            >
              <FaTwitter />
            </NavLink>
            <NavLink
              to="https://www.youtube.com/smartfarmer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-emerald-200 hover:scale-125 transition-all duration-300 cursor-pointer p-2 rounded-full hover:bg-emerald-700/30 w-10 h-10 flex items-center justify-center"
            >
              <FaYoutube />
            </NavLink>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-6 pt-4 border-t border-emerald-700/30 text-center">
        <p className="text-sm text-emerald-200">
          © 2025{" "}
          <span className="font-semibold text-emerald-300">
            Smart Farmer Platform
          </span>
          . All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};
