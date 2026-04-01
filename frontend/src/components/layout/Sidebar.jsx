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
      label: <Link to="/teachers">Professors</Link>,
    },
    {
      key: "/departments",
      icon: <AppstoreOutlined />,
      label: <Link to="/departments">Departments</Link>,
    },
    {
      key: "/courses",
      icon: <BookOutlined />,
      label: <Link to="/courses">Courses</Link>,
    },
    {
      key: "/rooms",
      icon: <CheckSquareOutlined />,
      label: <Link to="/rooms">Rooms</Link>,
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
      key: "/settings",
      icon: <SettingOutlined />,
      label: <Link to="/settings">Settings</Link>,
    },
  ];

  // HOD Items
  const hodItems = [
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
      label: <Link to="/teachers">Assign Professors</Link>,
    },
    {
      key: "/timetable",
      icon: <CalendarOutlined />,
      label: <Link to="/timetable">Manage Timetable</Link>,
    },
  ];

  // Teacher (Professor) Items
  const teacherItems = [
    {
      key: "/timetable",
      icon: <CalendarOutlined />,
      label: <Link to="/timetable">My Schedule</Link>,
    },
    {
      key: "/attendance",
      icon: <CheckSquareOutlined />,
      label: <Link to="/attendance">Attendance</Link>,
    },
    {
      key: "/notifications",
      icon: <BellOutlined />,
      label: <Link to="/notifications">Send Notification</Link>,
    },
  ];

  // Student Items
  const studentItems = [
    {
      key: "/timetable",
      icon: <CalendarOutlined />,
      label: <Link to="/timetable">My Timetable</Link>,
    },
    {
      key: "/attendance",
      icon: <CheckSquareOutlined />,
      label: <Link to="/attendance">My Attendance</Link>,
    },
    {
      key: "/notifications",
      icon: <BellOutlined />,
      label: <Link to="/notifications">Notifications</Link>,
    },
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
    <img
      src="/logoS.png"
      alt="Schedulify"
      className="h-12 object-contain"
    />
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