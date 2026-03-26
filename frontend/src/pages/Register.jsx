import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5001/api/auth/register",
        {
          name,
          email,
          password,
          role,
        }
      );

      console.log("REGISTER SUCCESS:", res.data);

      alert("Registration successful 🚀");

      // go to login page
      navigate("/login");

    } catch (err) {
      console.log(err.response?.data);
      alert(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800">
          Create Account
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Register with your role to get started
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Select Role
            </label>

            <div className="grid grid-cols-2 gap-3 mt-2">
              {["admin", "hod", "teacher", "student"].map((r) => (
                <div
                  key={r}
                  onClick={() => setRole(r)}
                  className={`cursor-pointer border rounded-lg p-3 text-sm transition
                    ${
                      role === r
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-300"
                    }`}
                >
                  <p className="font-semibold capitalize">{r}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              placeholder="you@university.edu"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg
                       font-semibold shadow-md hover:bg-blue-600
                       active:scale-95 transition-all"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          {/* Login Link */}
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}