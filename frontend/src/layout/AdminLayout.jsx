import { Layout, notification as antdNotification } from "antd";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const { Content } = Layout;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  // Setup WebSockets for Real-Time Notifications
  useEffect(() => {
    if (!user) return;

    // Connect to Backend WebSocket
    const socket = io("http://localhost:5001", {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("🟢 Connected to Real-time Notification System");
    });

    socket.on("new-notification", (data) => {
      // Show notification popup in UI
      antdNotification.open({
        message: `New ${data.type === "leave" ? "Leave " : ""}Notification`,
        description: data.message,
        placement: "topRight",
        style: {
          borderRadius: "12px",
          borderLeft: data.type === "urgent" ? "6px solid #ef4444" : "6px solid #3b82f6",
        },
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <Layout className="min-h-screen font-sans bg-gray-50">

      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />

      {/* Right Side */}
      <Layout className="bg-transparent transition-all duration-300">

        {/* Topbar */}
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content className="p-4 md:p-8">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100/50 p-6 md:p-8 min-h-[calc(100vh-120px)] transition-all duration-300 relative overflow-hidden">
            {/* Subtle Gradient Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            
            <Outlet />
          </div>
        </Content>

      </Layout>

    </Layout>
  );
}