import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled
        ? "bg-gradient-to-br from-[#0b2a3d] via-[#1e4a6a] to-[#0b2a3d] backdrop-blur-md shadow-lg border-white/10 py-2"
        : "bg-gradient-to-br from-[#0b2a3d] via-[#1e4a6a] to-[#0b2a3d] border-transparent py-4"
        } text-white`}
    >
      <div className="w-full px-6 md:px-12 lg:px-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 text-xl font-bold tracking-wide">
          <CalendarDays className="w-8 h-8 text-cyan-400" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Schedulify
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="relative text-[15px] font-medium tracking-wide !text-gray-200 hover:!text-cyan-400 transition duration-300 group no-underline"
            >
              {item.name}
              {/* underline animation */}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Buttons */}
        <div className="hidden md:flex gap-4">
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 rounded-lg bg-cyan-500 text-slate-900 font-semibold shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:bg-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] transition-all duration-300"
            >
              Login
            </motion.button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-200 hover:text-cyan-400 transition"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0f172a] border-t border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-4 flex flex-col">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-gray-100 font-medium text-lg hover:text-cyan-400 transition"
                >
                  {item.name}
                </a>
              ))}
              <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <button className="w-full py-3 rounded-lg bg-cyan-500 text-slate-900 font-semibold shadow-md hover:bg-cyan-400 transition-all duration-300">
                    Login
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;