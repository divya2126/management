import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1e3a8a]/90 backdrop-blur-md text-white border-b border-white/10">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2 text-xl font-bold">
          <CalendarDays className="w-7 h-7" />
          Schedulify
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          {["Home", "Features", "About", "Contact"].map((item) => (
            <a key={item} href="#" className="hover:text-teal-300 transition">
              {item}
            </a>
          ))}
        </div>

        {/* Buttons */}
        <div className="hidden md:flex gap-3">
          <Link to="/login">
            <button className="px-4 py-2 rounded-lg bg-white text-black font-medium">
              Login
            </button>
          </Link>

          <Link to="/register">
            <button className="px-4 py-2 rounded-lg bg-teal-400 font-medium">
              Register
            </button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 py-4 space-y-4 bg-[#1e3a8a]">
          {["Home", "Features", "About", "Contact"].map((item) => (
            <a key={item} href="#" className="block">
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;