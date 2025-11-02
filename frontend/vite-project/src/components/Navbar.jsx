// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FaBrain } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdLogout, MdHistory, MdPerson } from "react-icons/md";
import toast from "react-hot-toast";

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const onHistoryPage = pathname === "/history";

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  const doLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out");
    navigate("/login");
  };

  // close on click outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (!open) return;
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <nav className="w-full bg-gradient-to-r from-blue-900 to-cyan-600 text-white shadow-lg sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center">
        {/* Brand */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <FaBrain className="text-2xl" />
          <span className="text-lg font-semibold tracking-wide">Pharma Copilot</span>
        </Link>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">

          {/* Avatar button */}
          <div className="relative">
            <button
              ref={btnRef}
              onClick={() => setOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={open}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 px-3 py-1.5 transition focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-blue-900 font-semibold">
                Dr
              </span>
              <span className="hidden sm:inline text-sm">Account</span>
            </button>

            {/* Dropdown */}
            {open && (
              <div
                ref={menuRef}
                role="menu"
                className="absolute right-0 mt-2 w-44 rounded-xl bg-white text-slate-800 shadow-lg border overflow-hidden"
              >
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50"
                  role="menuitem"
                >
                  <MdPerson className="text-lg text-slate-600" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/history");
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50"
                  role="menuitem"
                >
                  <MdHistory className="text-lg text-slate-600" />
                  History
                </button>
                <div className="h-px bg-slate-200" />
                <button
                  onClick={doLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  role="menuitem"
                >
                  <MdLogout className="text-lg" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
