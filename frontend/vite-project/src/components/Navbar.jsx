import { Link, useLocation } from "react-router-dom";
import { FaBrain, FaUserCircle } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function Navbar() {
  const { pathname } = useLocation();
  const onHistoryPage = pathname === "/history";

  return (
    <nav className="w-full bg-gradient-to-r from-blue-900 to-cyan-600 text-white shadow-lg sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center">
        {/* Left: Brand */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <FaBrain className="text-2xl" />
          <span className="text-lg font-semibold tracking-wide">Pharma Copilot</span>
        </Link>

        {/* Right: actions (group them together!) */}
        <div className="ml-auto flex items-center gap-2">
          {/* Profile */}
          <Link
            to="/profile"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg px-3 py-1.5
                       bg-white/10 hover:bg-white/20 transition"
            title="Profile"
          >
            <FaUserCircle className="text-xl" />
            <span className="text-sm">Profile</span>
          </Link>

          {/* History / Home toggle */}
          {onHistoryPage ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5
                         bg-white text-blue-900 hover:bg-white/90 transition"
            >
              <IoIosArrowBack className="text-xl" />
              <span className="text-sm font-medium">Home</span>
            </Link>
          ) : (
            <Link
              to="/history"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5
                         bg-white text-blue-900 hover:bg-white/90 transition"
            >
              <span className="text-sm font-medium">View History</span>
              <IoIosArrowForward className="text-xl" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
