import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

const { Content } = Layout;

export default function AdminLayout() {
  return (
    <Layout className="min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <Layout className="bg-gray-100">

        <Topbar />

        <Content className="p-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[85vh]">
            <Outlet />
          </div>
        </Content>

      </Layout>

    </Layout>
  );
}