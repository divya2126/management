import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Teachers from "../pages/Teachers";
import Student from "../pages/Student"
import Timetable from "../pages/Timetable";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth Pages */}
        <Route path="/" element={<Login />} />

        {/* Admin Pages */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/student" element={<Student/>}/>
          <Route path="timetable" element={<Timetable/>}/>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}