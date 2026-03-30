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
  WalletOutlined,
  AppstoreOutlined,
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
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: "/student",
      icon: <UserOutlined />,
      label: <Link to="/student">Students</Link>,
    },
    {
      key: "/teachers",
      icon: <TeamOutlined />,
      label: <Link to="/teachers">Teachers</Link>,
    },
    {
      key: "/classes",
      icon: <AppstoreOutlined />,
      label: <Link to="/classes">Classes</Link>,
    },
    {
      key: "/subjects",
      icon: <BookOutlined />,
      label: <Link to="/subjects">Subjects</Link>,
    },
    {
      key: "/attendance",
      icon: <CheckSquareOutlined />,
      label: <Link to="/attendance">Attendance</Link>,
    },
    {
      key: "/exams",
      icon: <ProfileOutlined />,
      label: <Link to="/exams">Exams</Link>,
    },
    {
      key: "/timetable",
      icon: <CalendarOutlined />,
      label: <Link to="/timetable">Timetable</Link>,
    },
    {
      key: "/fee",
      icon: <WalletOutlined />,
      label: <Link to="/fee">Fee Management</Link>,
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: <Link to="/settings">Settings</Link>,
    },
  ];

  // Teacher Items
  const teacherItems = [
    {
      key: "/modules",
      icon: <BookOutlined />,
      label: <Link to="/modules">My Modules</Link>,
    },
    {
      key: "/attendance",
      icon: <CheckSquareOutlined />,
      label: <Link to="/attendance">Attendance</Link>,
    },
    {
      key: "/exams",
      icon: <ProfileOutlined />,
      label: <Link to="/exams">Exams</Link>,
    },
    {
      key: "/timetable",
      icon: <CalendarOutlined />,
      label: <Link to="/timetable">My Schedule</Link>,
    },
  ];

  // Student Items
  const studentItems = [
    {
      key: "/timetable",
      icon: <CalendarOutlined />,
      label: <Link to="/timetable">My Timetable</Link>,
    },
  ];

  // Pick correct items
  let items = baseItems;
  if (user?.role === "admin") items = adminItems;
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
      <div className="text-xl font-bold text-center p-4 text-white tracking-wide border-b border-white/10">
        {!collapsed ? "Schedulify" : "SF"}
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