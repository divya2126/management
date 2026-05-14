import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";

const floatingBoxes = [
  { width: 60,  height: 60,  top: "8%",  left: "5%",  duration: 6,  delay: 0,   rotate: 45 },
  { width: 40,  height: 40,  top: "15%", left: "80%", duration: 8,  delay: 1,   rotate: 20 },
  { width: 80,  height: 80,  top: "70%", left: "10%", duration: 7,  delay: 0.5, rotate: 60 },
  { width: 30,  height: 30,  top: "55%", left: "88%", duration: 5,  delay: 2,   rotate: 30 },
  { width: 50,  height: 50,  top: "85%", left: "60%", duration: 9,  delay: 1.5, rotate: 15 },
  { width: 25,  height: 25,  top: "30%", left: "92%", duration: 6,  delay: 0.8, rotate: 75 },
  { width: 70,  height: 70,  top: "40%", left: "2%",  duration: 10, delay: 0.3, rotate: 50 },
  { width: 35,  height: 35,  top: "90%", left: "30%", duration: 7,  delay: 2.5, rotate: 40 },
];

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessageText("");

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5001/api/auth/forgot-password", { email });
      setMessageText(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b2a3d] via-[#1e4a6a] to-[#0b2a3d] px-4 py-16 overflow-hidden">
      {/* Floating Animated Boxes */}
      {floatingBoxes.map((box, i) => (
        <motion.div
          key={i}
          className="absolute rounded-xl border border-cyan-400/20 bg-white/5 backdrop-blur-sm"
          style={{ width: box.width, height: box.height, top: box.top, left: box.left }}
          animate={{ y: [0, -20, 0], rotate: [box.rotate, box.rotate + 15, box.rotate], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: box.duration, delay: box.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#81A6C6]/10 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        <div className="mb-6">
          <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-cyan-600 transition">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to login
          </Link>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center">
            <Mail className="w-7 h-7 text-cyan-600" />
          </div>
        </div>

        {/* Heading */}
        <div
          className="font-bold text-center mb-1 bg-gradient-to-r from-cyan-600 to-[#1e4a6a] bg-clip-text text-transparent"
          style={{ fontSize: "17px" }}
        >
          Forgot Password?
        </div>
        <p className="text-center text-gray-500 text-xs mb-6">
          No worries, we'll send you reset instructions.
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {messageText && (
          <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-center">
            {messageText}
          </div>
        )}

        {!messageText && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-cyan-600 active:scale-95 transition-all mt-2"
            >
              {loading ? "Sending..." : "Reset Password"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
