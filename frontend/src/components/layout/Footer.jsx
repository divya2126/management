import { CalendarDays, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      id="about"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gradient-to-br from-[#0b2a3d] via-[#1e4a6a] to-[#0b2a3d] text-white"
    >
      <div className="w-full px-6 md:px-12 lg:px-20 py-8 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">

        {/* Logo & Description */}
        <div className="md:col-span-5 lg:col-span-5">
          <div className="flex items-center gap-2 text-xl font-bold tracking-wide">
            <CalendarDays className="w-8 h-8 text-cyan-400" />

            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
              Schedulify
            </span>
          </div>

          <p className="mt-3 text-xs text-gray-300 leading-relaxed max-w-sm">
            Smart timetable management for institutions — efficient, intuitive scheduling.
          </p>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-2 lg:col-span-2">
          <h3 className="font-semibold text-white mb-3 tracking-wide uppercase text-xs">
            Quick Links
          </h3>

          <ul className="space-y-2 text-xs">
            <li>
              <a
                href="#home"
                className="!text-white visited:!text-white hover:!text-cyan-400 transition duration-200 no-underline"
              >
                Home
              </a>
            </li>

            <li>
              <a
                href="#features"
                className="!text-white visited:!text-white hover:!text-cyan-400 transition duration-200 no-underline"
              >
                Features
              </a>
            </li>

            <li>
              <a
                href="#about"
                className="!text-white visited:!text-white hover:!text-cyan-400 transition duration-200 no-underline"
              >
                About
              </a>
            </li>

            <li>
              <a
                href="#contact"
                className="!text-white visited:!text-white hover:!text-cyan-400 transition duration-200 no-underline"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div className="md:col-span-2 lg:col-span-2">
          <h3 className="font-semibold text-white mb-3 tracking-wide uppercase text-xs">
            Legal
          </h3>

          <ul className="space-y-2 text-xs">
            <li>
              <a
                href="#"
                className="!text-white visited:!text-white hover:!text-cyan-400 transition duration-200 no-underline"
              >
                Privacy Policy
              </a>
            </li>

            <li>
              <a
                href="#"
                className="!text-white visited:!text-white hover:!text-cyan-400 transition duration-200 no-underline"
              >
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div
          id="contact"
          className="md:col-span-3 lg:col-span-3 lg:text-right"
        >
          <h3 className="font-semibold text-white mb-3 tracking-wide uppercase text-xs">
            Contact
          </h3>

          <ul className="space-y-2 text-xs text-white flex flex-col lg:items-end">
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-cyan-400 lg:hidden" />

              <span className="text-white">
                support@schedulify.com
              </span>

              <Mail className="w-4 h-4 text-cyan-400 hidden lg:block" />
            </li>

            <li className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-cyan-400 lg:hidden" />

              <span className="text-white">
                Punjab, India
              </span>

              <MapPin className="w-4 h-4 text-cyan-400 hidden lg:block" />
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10 text-center py-3 text-xs text-gray-400">
        © {new Date().getFullYear()} Schedulify. All rights reserved.
        Designed for Education.
      </div>
    </motion.footer>
  );
};

export default Footer;