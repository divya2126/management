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

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      width={230}
      className="min-h-screen bg-white shadow-sm color-bg- blue"
      trigger={null}
    >
      <div className="text-xl font-bold text-center p-4">
        {!collapsed ? "EduAdmin" : "EA"}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        className="border-none"
      >
        <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>

        <Menu.Item key="/teachers" icon={<TeamOutlined />}>
          <Link to="/teachers">Teachers</Link>
        </Menu.Item>

        <Menu.Item key="/students" icon={<UserOutlined />}>
          <Link to="/student">Students</Link>
        </Menu.Item>

        <Menu.Item key="/timetable" icon={<CalendarOutlined />}>
          Timetable
        </Menu.Item>
      </Menu>
    </Sider>
  );
}