import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

import Dashboard from "../pages/Dashboard";
import Teachers from "../pages/Teachers";
import Student from "../pages/Student";
import Timetable from "../pages/Timetable";
import AdminLayout from "../layout/AdminLayout";
import ProtectedRoute from "../app/ProtectedRoute";


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main Dashboard Layout (Shared wrapping) */}
        <Route element={<AdminLayout />}>
          
          {/* Admin Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/student" element={<Student />} />
            {/* Adding the other links for completion based off the visual */}
            <Route path="/classes" element={<div className="p-6">Classes coming soon</div>} />
            <Route path="/subjects" element={<div className="p-6">Subjects coming soon</div>} />
          </Route>

          {/* Admin & Teacher Shared Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "teacher"]} />}>
            <Route path="/modules" element={<div>Modules feature coming soon</div>} />
            <Route path="/attendance" element={<div>Attendance tracking coming soon</div>} />
            <Route path="/exams" element={<div>Exams coming soon</div>} />
          </Route>

          {/* Shared by Everyone */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "teacher", "student"]} />}>
            <Route path="/timetable" element={<Timetable />} />
          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;