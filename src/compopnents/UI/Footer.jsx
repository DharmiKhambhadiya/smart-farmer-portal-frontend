import { MdLocationPin } from "react-icons/md";
import { FaYoutube, FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-[#5D4037] text-[#f3e9dc] px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Contact Info */}
        <div>
          <h4 className="text-3xl font-bold text-white italic tracking-wide mb-4">
            Smart Farmer
          </h4>
          <p className="flex items-center gap-2 mb-2">
            <MdLocationPin className="text-[#ffd369] w-6 h-6" />
            <span>
              Address: 312E, Unknown Street, Undefined Road, Botad, Gujarat,
              India
            </span>
          </p>
          <p className="mb-2">
            Call Us: <span className="text-white">+91 9876543211</span>
          </p>
          <p>
            Email: <span className="text-white">sfp2005@sfp.com</span>
          </p>
        </div>

        {/* Company Info */}
        <div>
          <h4 className="text-xl font-semibold text-[#fffaf0] mb-4">Company</h4>
          <ul className="space-y-2">
            <li>About Us</li>
            <li>Delivery Information</li>
            <li>Privacy and Policy</li>
            <li>Follow Us</li>
          </ul>
        </div>

        {/* Account Info */}
        <div>
          <h4 className="text-xl font-semibold text-[#fffaf0] mb-4">Account</h4>
          <ul className="space-y-2">
            <li>Sign In</li>
            <li>View Cart</li>
            <li>Shipping Details</li>
          </ul>
        </div>

        {/* Social Icons */}
        <div>
          <h4 className="text-xl font-semibold text-[#fffaf0] mb-4">
            Follow Us
          </h4>
          <div className="flex space-x-4 text-2xl text-[#d7ccc8]">
            <FaFacebook className="hover:text-[#ffd369] transition duration-300" />
            <FaInstagram className="hover:text-[#ffd369] transition duration-300" />
            <FaTwitter className="hover:text-[#ffd369] transition duration-300" />
            <FaYoutube className="hover:text-[#ffd369] transition duration-300" />
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-10 border-t border-[#a1887f] pt-4 text-center text-sm text-[#d7ccc8]">
        © 2025 SFP. All Rights Reserved.
      </div>
    </footer>
  );
};
