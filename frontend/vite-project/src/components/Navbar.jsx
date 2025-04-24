// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="w-full bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <div>
        {pathname === "/" && (
          <Link
            to="/history"
            className="text-sm font-medium text-gray-600 hover:text-blue-600"
          >
            View History →
          </Link>
        )}
        {pathname === "/history" && (
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 hover:text-blue-600"
          >
            ← Back to Home
          </Link>
        )}
      </div>
    </nav>
  );
}
