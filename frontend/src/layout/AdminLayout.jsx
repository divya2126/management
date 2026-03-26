import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { useState } from "react";   // ✅ IMPORT THIS
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

const { Content } = Layout;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);  // ✅ ADD STATE

  return (
    <Layout className="min-h-screen">

      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />

      {/* Right Side */}
      <Layout className="bg-gray-100">

        {/* Topbar */}
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content className="p-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[85vh]">
            <Outlet />
          </div>
        </Content>

      </Layout>

    </Layout>
  );
}