import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (role === "admin") navigate("/admin");
    else if (role === "hod") navigate("/hod");
    else if (role === "teacher") navigate("/teacher");
    else navigate("/student");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800">Create account</h2>
        <p className="text-sm text-gray-500 mb-6">
          Register with your role to get started
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-400 
                         focus:border-blue-400 transition"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Role Selection */}
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
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-300 hover:border-blue-300"
                  }`}
                >
                  <p className="font-semibold capitalize text-gray-800">{r}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {r === "admin" && "Control"}
                    {r === "hod" && "Department management"}
                    {r === "teacher" && "Schedule & preferences"}
                    {r === "student" && "View timetable"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-400 
                         focus:border-blue-400 transition"
              placeholder="you@university.edu"
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
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-400 
                         focus:border-blue-400 transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <br></br>
          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg 
                       font-semibold shadow-md hover:bg-blue-600 
                       active:scale-95 transition-all duration-200"
          >
            Create Account
          </button>
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
