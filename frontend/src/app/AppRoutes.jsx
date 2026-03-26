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

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/student" element={<Student />} />
          <Route path="/timetable" element={<Timetable />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;