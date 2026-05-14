import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";

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

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`http://localhost:5001/api/auth/reset-password/${token}`, {
        password: newPassword,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
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
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center">
            <LockKeyhole className="w-7 h-7 text-cyan-600" />
          </div>
        </div>

        {/* Heading */}
        <div
          className="font-bold text-center mb-1 bg-gradient-to-r from-cyan-600 to-[#1e4a6a] bg-clip-text text-transparent"
          style={{ fontSize: "17px" }}
        >
          Reset Password
        </div>
        <p className="text-center text-gray-500 text-xs mb-6">
          Enter your new password below to access your account.
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center">
            <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              Your password has been successfully reset!
            </div>
            <Link
              to="/login"
              className="inline-block w-full bg-cyan-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-cyan-600 transition-all mt-2"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">New Password</label>
              <div className="relative mt-1">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative mt-1">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your password"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-cyan-600 active:scale-95 transition-all mt-2"
            >
              {loading ? "Saving..." : "Reset Password"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
