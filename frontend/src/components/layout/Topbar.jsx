import { Layout, Avatar, Dropdown, Popover, List, Button } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SearchOutlined,
  LogoutOutlined,
  NotificationOutlined,
  CalendarOutlined,
  WarningOutlined
} from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { io } from "socket.io-client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const { Header } = Layout;

export default function Topbar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    const socket = io("http://localhost:5001", {
      withCredentials: true,
    });

    socket.on("new-notification", (data) => {
      if (data.targetRole === "all" || data.targetRole === user.role || user.role === "admin") {
        setNotifications((prev) => [
          {
            id: data._id,
            text: data.message,
            type: data.type,
            senderName: data.senderId?.name || "System",
            createdAt: data.createdAt || new Date(),
            read: false,
          },
          ...prev,
        ]);
      }
    });

    return () => socket.disconnect();
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      if (res.data.success) {
        setNotifications(
          res.data.notifications.map((n) => ({
            id: n._id,
            text: n.message,
            type: n.type,
            senderName: n.senderId?.name || "System",
            createdAt: n.createdAt,
            // Assuming old ones are read for now, or just track locally
            read: false,
          }))
        );
      }
    } catch (err) {
      console.log("Failed to load notifications");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  const handleSearch = (value) => {
    const text = value.toLowerCase();
    if (text.includes("student")) navigate("/students");
    else if (text.includes("teacher")) navigate("/teachers");
    else if (text.includes("attendance")) navigate("/attendance");
    else if (text.includes("timetable")) navigate("/timetable");
  };

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
  };

  const handleOpenChange = (newOpen) => {
    setPopoverOpen(newOpen);
    if (newOpen) {
      // Mark as read when opening drop down
      markAllRead();
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const menuItems = [
    {
      key: "1",
      icon: <LogoutOutlined />,
      label: "Sign out",
      onClick: handleLogout,
    },
  ];

  const getIcon = (type) => {
    if (type === "urgent") return <WarningOutlined />;
    if (type === "leave") return <CalendarOutlined />;
    return <NotificationOutlined />;
  };

  const notificationContent = (
    <div className="w-80 max-h-[400px] overflow-hidden flex flex-col -m-3">
      <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50/50 backdrop-blur-md">
        <h3 className="font-bold text-gray-800 m-0">Notifications</h3>
        <Button type="link" size="small" onClick={markAllRead} className="text-xs p-0 h-auto font-medium">
          Mark all read
        </Button>
      </div>
      
      <div className="overflow-y-auto flex-1 custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <BellOutlined className="text-3xl mb-2 opacity-30" />
            <p className="text-sm">No new notifications</p>
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-default ${
                  !item.read ? "bg-blue-50/30" : "bg-white"
                }`}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      className={`shadow-sm flex items-center justify-center ${
                        item.type === "urgent" ? "bg-red-100 text-red-500" : 
                        item.type === "leave" ? "bg-green-100 text-green-500" : 
                        "bg-blue-100 text-blue-500"
                      }`}
                    >
                      {getIcon(item.type)}
                    </Avatar>
                  }
                  title={
                    <div className="flex justify-between w-full relative -top-1">
                      <span className="text-sm font-semibold text-gray-800 tracking-tight">
                        {item.senderName}
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">
                        {dayjs(item.createdAt).fromNow()}
                      </span>
                    </div>
                  }
                  description={
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {item.text}
                    </p>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className="border-t bg-gray-50 p-2 text-center text-xs text-blue-500 font-medium cursor-pointer hover:bg-gray-100 transition-colors">
          View All History
        </div>
      )}
    </div>
  );

  return (
    <Header
      className="shadow-sm flex justify-between items-center px-6 border-b border-gray-100/50 sticky top-0 z-40"
      style={{ height: "70px", backgroundColor: "#ffffff" }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-xl text-gray-400 hover:text-blue-500 transition-colors mt-1"
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-5 text-gray-500 mt-2">
          
          <SearchOutlined
            className="text-xl cursor-pointer hover:text-blue-500 transition-colors"
            onClick={() => {
              const value = prompt("Search (student, teacher, timetable...)");
              if (value) {
                setSearchText(value);
                handleSearch(value);
              }
            }}
          />

          <Popover
            content={notificationContent}
            trigger="click"
            placement="bottomRight"
            open={popoverOpen}
            onOpenChange={handleOpenChange}
            overlayInnerStyle={{ padding: 0, borderRadius: '12px', overflow: 'hidden' }}
          >
            <div className="relative mr-2 cursor-pointer flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors">
              <BellOutlined className="text-xl" />

              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 border border-white"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white shadow-sm"></span>
                </span>
              )}
            </div>
          </Popover>
        </div>

        <div className="h-8 w-px bg-gray-200"></div>

        <Dropdown
          menu={{ items: menuItems }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-all -ml-2 border border-transparent hover:border-gray-100">
            <Avatar className="bg-indigo-600 text-white font-medium flex items-center justify-center shadow-md shadow-indigo-200">
              {user ? getInitials(user.name) : "AD"}
            </Avatar>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-bold text-gray-700 leading-none">
                {user?.email || "user@example.com"}
              </span>
              <span className="text-[11px] text-indigo-500 font-bold uppercase tracking-wider leading-tight mt-1">
                {user?.role || "user"}
              </span>
            </div>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
}