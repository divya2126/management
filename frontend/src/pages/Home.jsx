import { useState } from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  CalendarOutlined,
  TeamOutlined,
} from "@ant-design/icons";




import TimetableGrid from "../components/TimetableGrid";

const { Header, Sider, Content } = Layout;

const Home = () => {
  const [selectedMenu, setSelectedMenu] = useState("dashboard");

  const renderContent = () => {
    switch (selectedMenu) {
      case "dashboard":
        return <Dashboard />;

      case "timetable":
        return <TimetableGrid />;

      case "users":
        return <Users />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="dark">
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          onClick={(e) => setSelectedMenu(e.key)}
          items={[
            {
              key: "dashboard",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
            {
              key: "timetable",
              icon: <CalendarOutlined />,
              label: "Timetable",
            },
            {
              key: "users",
              icon: <TeamOutlined />,
              label: "Users",
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header style={{ background: "#fff", paddingLeft: 20 }}>
          College Timetable Management
        </Header>

        <Content style={{ margin: 20, padding: 20, background: "#fff" }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
