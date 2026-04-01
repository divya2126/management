import { Layout, Avatar, Dropdown } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const { Header } = Layout;

export default function Topbar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // 🔍 SEARCH STATE
  const [searchText, setSearchText] = useState("");

  // 🔔 NOTIFICATION STATE
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New student added", read: false },
    { id: 2, text: "Timetable updated", read: false },
    { id: 3, text: "Leave request pending", read: true },
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  // 🔍 SEARCH FUNCTION
  const handleSearch = (value) => {
    const text = value.toLowerCase();

    if (text.includes("student")) navigate("/students");
    else if (text.includes("teacher")) navigate("/teachers");
    else if (text.includes("attendance")) navigate("/attendance");
    else if (text.includes("timetable")) navigate("/timetable");
  };

  // 🔔 MARK AS READ
  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
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

  return (
    <Header
      className="bg-white shadow-sm flex justify-between items-center px-6 border-b"
      style={{ background: "#ffffff", height: "70px" }}
    >
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-xl text-gray-600 hover:text-gray-900 transition mt-1"
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-gray-500 mt-2">
          
          {/* 🔍 SEARCH */}
          <SearchOutlined
            className="text-xl cursor-pointer hover:text-blue-500 transition"
            onClick={() => {
              const value = prompt("Search (student, teacher, timetable...)");
              if (value) {
                setSearchText(value);
                handleSearch(value);
              }
            }}
          />

          {/* 🔔 NOTIFICATION */}
          <div className="relative mr-2">
            <BellOutlined
              className="text-xl cursor-pointer hover:text-blue-500 transition"
              onClick={() => setShowNotifications(!showNotifications)}
            />

            {/* Red Dot */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            )}

            {/* Dropdown (no style change) */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-64 bg-white shadow-lg border rounded-md z-50">
                <div className="flex justify-between items-center p-2 border-b text-sm">
                  <span>Notifications</span>
                  <button
                    className="text-blue-500 text-xs"
                    onClick={markAllRead}
                  >
                    Mark all read
                  </button>
                </div>

                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2 text-sm ${
                      !n.read ? "bg-gray-100" : ""
                    }`}
                  >
                    {n.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200"></div>

        {/* Profile */}
        <Dropdown
          menu={{ items: menuItems }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition -ml-2">
            <Avatar className="bg-teal-500 text-white font-medium flex items-center justify-center">
              {user ? getInitials(user.name) : "AD"}
            </Avatar>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-semibold text-gray-700 leading-none">
                {user?.email || "user@example.com"}
              </span>
              <span className="text-xs text-blue-500 capitalize leading-tight mt-1">
                {user?.role || "user"}
              </span>
            </div>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
}