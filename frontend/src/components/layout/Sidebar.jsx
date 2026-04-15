import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
  BookOutlined,
  CheckSquareOutlined,
  ProfileOutlined,
  SettingOutlined,
  AppstoreOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


const { Sider } = Layout;

export default function Sidebar({ collapsed }) {
  const location = useLocation();
  const { user } = useAuth(); // ⭐ Use dynamic roles

  // Base items available to everyone
  const baseItems = [];

  // Admin Items
  const adminItems = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: <Link to="/dashboard">Dashboard</Link> },
    { key: "/departments", icon: <AppstoreOutlined />, label: <Link to="/departments">Departments</Link> },
    { key: "/courses", icon: <BookOutlined />, label: <Link to="/courses">Courses</Link> },
    { key: "/subjects", icon: <BookOutlined />, label: <Link to="/subjects">Subjects</Link> },
    { key: "/rooms", icon: <CheckSquareOutlined />, label: <Link to="/rooms">Rooms</Link> },
    { key: "/teachers", icon: <TeamOutlined />, label: <Link to="/teachers">Professors / HOD</Link> },
    { key: "/student", icon: <UserOutlined />, label: <Link to="/student">Students</Link> },
    { key: "/leave-requests", icon: <UserOutlined />, label: <Link to="/leave-requests">Leave Approvals</Link> },
    { key: "/send-notification", icon: <BellOutlined />, label: <Link to="/send-notification">Send Notice</Link> },
    { key: "/timetable", icon: <CalendarOutlined />, label: <Link to="/timetable">Timetable</Link> },
    { key: "/settings", icon: <SettingOutlined />, label: <Link to="/settings">Settings</Link> },
  ];

  // HOD Items
  const hodItems = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: <Link to="/dashboard">Dashboard</Link> },
    { key: "/courses", icon: <BookOutlined />, label: <Link to="/courses">Courses</Link> },
    { key: "/subjects", icon: <BookOutlined />, label: <Link to="/subjects">Subjects</Link> },
    { key: "/rooms", icon: <CheckSquareOutlined />, label: <Link to="/rooms">Rooms</Link> },
    { key: "/teachers", icon: <TeamOutlined />, label: <Link to="/teachers">Add Professors</Link> },
    { key: "/student", icon: <UserOutlined />, label: <Link to="/student">Add Students</Link> },
    { key: "/leave-requests", icon: <UserOutlined />, label: <Link to="/leave-requests">Leave Approvals</Link> },
    { key: "/send-notification", icon: <BellOutlined />, label: <Link to="/send-notification">Send Notice</Link> },
    { key: "/exams", icon: <ProfileOutlined />, label: <Link to="/exams">Exams</Link> },
    { key: "/timetable", icon: <CalendarOutlined />, label: <Link to="/timetable">Manage Timetable</Link> },
  ];

  // Teacher (Professor) Items
  const teacherItems = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: <Link to="/dashboard">Dashboard</Link> },
    { key: "/timetable", icon: <CalendarOutlined />, label: <Link to="/timetable">My Timetable</Link> },
    { key: "/attendance", icon: <CheckSquareOutlined />, label: <Link to="/attendance">Mark Attendance</Link> },
    { key: "/leave-requests", icon: <UserOutlined />, label: <Link to="/leave-requests">Request Leave</Link> },
    { key: "/send-notification", icon: <BellOutlined />, label: <Link to="/send-notification">Send Notification</Link> },
  ];

  // Student Items
  const studentItems = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: <Link to="/dashboard">Dashboard</Link> },
    { key: "/timetable", icon: <CalendarOutlined />, label: <Link to="/timetable">My Timetable</Link> },
    { key: "/attendance", icon: <CheckSquareOutlined />, label: <Link to="/attendance">My Attendance</Link> },
    { key: "/notifications", icon: <BellOutlined />, label: <Link to="/notifications">Notifications</Link> },
  ];

  // Pick correct items
  let items = baseItems;
  if (user?.role === "admin") items = adminItems;
  if (user?.role === "hod") items = hodItems;
  if (user?.role === "teacher") items = teacherItems;
  if (user?.role === "student") items = studentItems;

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      width={230}
      style={{ background: "#1e3a8a" }}
      className="min-h-screen shadow-lg"
      trigger={null}
    >
<div className="p-4 border-b border-white/10 flex items-center justify-center">
  {!collapsed ? (
    <div className="flex items-center">
      
      <h1 className="text-white font-bold text-xl ml-2">
        Schedulify
      </h1>
    </div>
  ) : (
    <span className="text-white font-bold text-lg">SF</span>
  )}
</div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
        style={{ background: "transparent", marginTop: "10px" }}
        className="border-none"
      />
    </Sider>
  );
}