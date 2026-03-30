import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const token = localStorage.getItem("token");

  // Show a simple loading state while AuthContext fetches user profile
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-semibold text-gray-500">Loading your workspace...</div>;
  }

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but trying to access an unauthorized route
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect logic base on their actual role
    if (user.role === "student") return <Navigate to="/timetable" replace />;
    if (user.role === "teacher") return <Navigate to="/modules" replace />; // We'll create modules later
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
}