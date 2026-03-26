import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Sider } = Layout;

export default function Sidebar({ collapsed }) {
  const location = useLocation();

  // ⭐ NEW ANT DESIGN FORMAT
  const items = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: "/teachers",
      icon: <TeamOutlined />,
      label: <Link to="/teachers">Teachers</Link>,
    },
    {
      key: "/student",
      icon: <UserOutlined />,
      label: <Link to="/student">Students</Link>, // fixed
    },
    {
      key: "/timetable",
      icon: <CalendarOutlined />,
      label: <Link to="/timetable">Timetable</Link>,
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      width={230}
      style={{ background: "#406093" }}
      className="min-h-screen bg-white shadow-sm"
      trigger={null}
    >
      <div className="text-xl font-bold text-center p-4">
        {!collapsed ? "Schedulify" : "SF"}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
        className="border-none"
      />
    </Sider>
  );
}