import { CalendarDays } from "lucide-react";

const Footer = () => {
  return (
    <footer id="about" className="bg-[#1e3a8a] text-gray-200 mt-16">
      <div className="container mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">

        {/* Logo & Description */}
        <div>
          <div className="flex items-center gap-2 text-lg font-bold text-white">
            <CalendarDays className="w-6 h-6" />
            Schedulify
          </div>
          <p className="mt-3 text-sm text-gray-300">
            Smart timetable management system for colleges to manage schedules efficiently.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-teal-300">Home</a></li>
            <li><a href="#" className="hover:text-teal-300">Features</a></li>
            <li><a href="#" className="hover:text-teal-300">About</a></li>
            <li><a href="#" className="hover:text-teal-300">Contact</a></li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="font-semibold text-white mb-3">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-teal-300">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-teal-300">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div id="contact">
          <h3 className="font-semibold text-white mb-3">Contact</h3>
          <p className="text-sm">📧 support@schedulify.com</p>
          <p className="text-sm mt-2">📍 Punjab, India</p>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} Schedulify. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;