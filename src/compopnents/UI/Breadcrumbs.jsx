import { Link, useLocation } from "react-router-dom";

const LABEL_MAP = {
  "about": "About",
  "shop": "Shop",
  "contact": "Contact",
  "cart": "Cart",
  "login": "Login",
  "signup": "Sign Up",
  "verify-otp": "Verify OTP",
  "changepassword": "Change Password",
  "reset-password": "Reset Password",
  "account": "Account",
  "shipping": "Shipping",
  // admin
  "admin": "Admin",
  "users": "Users",
  "products": "Products",
  "crops": "Crops",
  "orders": "Orders",
  "queries": "Queries",
};

function prettify(segment) {
  if (LABEL_MAP[segment]) return LABEL_MAP[segment];
  // Heuristic: if the segment looks like an id/hash, use a generic label
  if (/^[a-f0-9]{8,}$/.test(segment)) return "Details";
  return segment
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export const Breadcrumbs = () => {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null; // hide on home

  // Hide breadcrumbs on auth pages (login, signup)
  const HIDE_ON = new Set(["login", "signup"]);
  if (HIDE_ON.has(segments[0])) return null;

  let pathAcc = "";
  const items = segments.map((seg, idx) => {
    pathAcc += `/${seg}`;
    const isLast = idx === segments.length - 1;

    // Special-case: product detail should breadcrumb to Shop instead of Product
    if (seg === "product") {
      return {
        to: "/shop",
        label: "Shop",
        isLast,
      };
    }

    const label = prettify(seg);
    return {
      to: pathAcc,
      label,
      isLast,
    };
  });

  return (
    <nav className="bg-gray-50/70 border-y border-gray-100" aria-label="Breadcrumb">
      <ol className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3 text-base md:text-lg text-gray-600">
        <li>
          <Link to="/" className="inline-flex items-center hover:text-indigo-600 transition" aria-label="Home">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
              <path d="M11.47 3.84a.75.75 0 0 1 1.06 0l8.25 8.25a.75.75 0 1 1-1.06 1.06l-.72-.72V20.5a1.5 1.5 0 0 1-1.5 1.5h-3.75a.75.75 0 0 1-.75-.75v-3.75a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75v3.75a.75.75 0 0 1-.75.75H4.5A1.5 1.5 0 0 1 3 20.5v-8.07l-.72.72a.75.75 0 1 1-1.06-1.06l8.25-8.25Z"/>
            </svg>
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={item.to} className="flex items-center gap-2">
            <span className="text-gray-300 text-base md:text-lg">/</span>
            {item.isLast ? (
              <span className="text-gray-800 font-medium" aria-current="page">{item.label}</span>
            ) : (
              <Link to={item.to} className="hover:text-indigo-600 transition">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
