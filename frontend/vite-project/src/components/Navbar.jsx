import { Link, useLocation } from "react-router-dom";
import { FaBrain } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="w-full bg-gradient-to-r from-blue-900 to-cyan-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left side: Brand + Icon */}
        <div className="flex items-center gap-2">
          <FaBrain className="text-2xl" />
          <Link to="/dashboard" className="text-xl font-bold tracking-wide">
            Pharma Copilot
          </Link>
        </div>

        {/* Right side: Navigation */}
        <div>
          {pathname !== "/history" ? (
            <Link
              to="/history"
              className="btn btn-sm btn-outline border-white text-white hover:bg-white hover:text-blue-900"
            >
              <div className="flex items-center space-x-2 cursor-pointer">
              <span>View History</span>
                <IoIosArrowForward className="text-xl" />
              </div>
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className="btn btn-sm btn-outline border-white text-white hover:bg-white hover:text-blue-900"
            >
              <div className="flex items-center space-x-2 cursor-pointer">
                <IoIosArrowBack className="text-xl" />
                <span>Home</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
