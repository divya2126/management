import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1e3a8a]/90 backdrop-blur-md text-white border-b border-white/10">
      <div className="p-5 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-1 text-xl font-bold tracking-wide">
          <CalendarDays className="w-7 h-7" />
          Schedulify
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="relative text-[15px] font-semibold tracking-wide text-white hover:text-teal-300 transition duration-300 group"
            >
              {item.name}

              {/* underline animation */}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-teal-300 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Buttons */}
        <div className="hidden md:flex gap-3">
          <Link to="/login">
            <button className="px-4 py-2 rounded-lg bg-white text-black font-medium cursor-pointer">
              Login
            </button>
          </Link>

          <Link to="/register">
            <button className="px-4 py-2 rounded-lg bg-teal-400 font-medium cursor-pointer hover:bg-text-gray-200 hover:text-black transition duration-300">
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
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block text-gray-200 font-medium text-base hover:text-teal-300 transition"
            >
              {item.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;