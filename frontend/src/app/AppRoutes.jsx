import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import ChangePassword from "../pages/ChangePassword";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

import Dashboard from "../pages/Dashboard";
import Teachers from "../pages/Teachers";
import Student from "../pages/Student";
import Timetable from "../pages/Timetable";
import Departments from "../pages/Departments";
import Courses from "../pages/Courses";
import Subjects from "../pages/Subjects";
import Rooms from "../pages/Rooms";
import Attendance from "../pages/Attendance";
import LeaveRequests from "../pages/LeaveRequests";
import SendNotification from "../pages/SendNotification";
import Exams from "../pages/Exams";
import ManageResults from "../pages/ManageResults";
import MyResults from "../pages/MyResults";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";
import AdminLayout from "../layout/AdminLayout";
import ProtectedRoute from "../app/ProtectedRoute";


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Main Dashboard Layout (Shared wrapping) */}
        <Route element={<AdminLayout />}>
          
          {/* Admin Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/departments" element={<Departments />} />
          </Route>

          {/* Admin & HOD Shared Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "hod"]} />}>
            <Route path="/courses" element={<Courses />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/student" element={<Student />} />
            <Route path="/exams" element={<Exams />} />
          </Route>

          {/* Admin, HOD, & Teacher Shared Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "hod", "teacher"]} />}>
            <Route path="/leave-requests" element={<LeaveRequests />} />
          </Route>

          {/* Shared by Everyone */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "hod", "teacher", "student"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/send-notification" element={<SendNotification />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

        {/* Results Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin", "hod", "teacher"]} />}>
          <Route path="/manage-results" element={<ManageResults />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/my-results" element={<MyResults />} />
        </Route>

      </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;