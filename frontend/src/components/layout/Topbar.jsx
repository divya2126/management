import { Layout, Avatar, Dropdown, Popover, List, Button, Input, AutoComplete } from "antd";
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
  const [searchOptions, setSearchOptions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    const token = localStorage.getItem("token");
    const socket = io("http://localhost:5001", {
      withCredentials: true,
      auth: { token },
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
    return name.charAt(0).toUpperCase();
  };

  const getAvatarColor = (name) => {
    if (!name) return "#81A6C6";
    const colors = ["#EF4444", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const globalRoutes = [
    { value: "Dashboard", url: "/dashboard" },
    { value: "Students Directory", url: "/student" },
    { value: "Teachers / Professors", url: "/teachers" },
    { value: "Timetable & Schedule", url: "/timetable" },
    { value: "Attendance Records", url: "/attendance" },
    { value: "Notifications", url: "/notifications" },
    { value: "Subjects & Courses", url: "/subjects" },
    { value: "Leave Requests", url: "/leave-requests" },
    { value: "Rooms & Infrastructure", url: "/rooms" },
  ];

  const handleSearchInput = (value) => {
    setSearchText(value);
    if (!value) {
      setSearchOptions([]);
      return;
    }
    const filtered = globalRoutes
      .filter(route => route.value.toLowerCase().includes(value.toLowerCase()))
      .map(route => ({
        value: route.value,
        url: route.url,
        label: (
          <div className="flex justify-between items-center py-1.5 px-1">
            <span className="font-semibold text-[#1e4a6a] text-[14px]">{route.value}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold bg-gray-50 px-2 py-0.5 rounded">Jump</span>
          </div>
        )
      }));
      
    if (filtered.length === 0) {
      filtered.push({
        value: value,
        url: "/student",
        state: { searchQuery: value },
        label: (
          <div className="flex justify-between items-center py-1.5 px-1">
            <span className="font-semibold text-gray-600 text-[14px]">Search Students for "{value}"</span>
            <span className="text-[10px] text-cyan-600 uppercase tracking-wider font-bold bg-cyan-50 px-2 py-0.5 rounded">Students</span>
          </div>
        )
      });
      filtered.push({
        value: value,
        url: "/teachers",
        state: { searchQuery: value },
        label: (
          <div className="flex justify-between items-center py-1.5 px-1">
            <span className="font-semibold text-gray-600 text-[14px]">Search Teachers for "{value}"</span>
            <span className="text-[10px] text-purple-600 uppercase tracking-wider font-bold bg-purple-50 px-2 py-0.5 rounded">Teachers</span>
          </div>
        )
      });
    }
    setSearchOptions(filtered);
  };

  const handleSelect = (value, option) => {
    setSearchText("");
    setSearchOptions([]);
    if (option && option.url) {
      navigate(option.url, { state: option.state || {} });
    }
  };

  const handleSearch = (value) => {
    if (!value.trim()) return;
    const text = value.toLowerCase();
    
    if (text.includes("teacher") || text.includes("prof") || text.includes("hod")) {
      navigate("/teachers");
    } else if (text.includes("attendance")) {
      navigate("/attendance");
    } else if (text.includes("time") || text.includes("schedule")) {
      navigate("/timetable");
    } else {
      // Default to student directory for specific name searches
      navigate("/student");
    }
    
    setSearchText(""); // Clear the input after searching
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
    <div className="w-80 max-h-[400px] overflow-hidden flex flex-col -m-3 font-sans">
      <div className="flex justify-between items-center px-4 py-3 border-b bg-white backdrop-blur-md sticky top-0 z-10">
        <h3 className="font-bold text-[#1e4a6a] m-0 tracking-tight">Notifications</h3>
        <Button type="link" size="small" onClick={markAllRead} className="text-xs p-0 h-auto font-medium text-cyan-600 hover:text-cyan-700">
          Mark all read
        </Button>
      </div>
      
      <div className="overflow-y-auto flex-1 custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-full flex items-center justify-center mb-4 border border-cyan-100 shadow-sm">
              <BellOutlined className="text-2xl text-cyan-500" />
            </div>
            <p className="text-sm font-bold text-[#1e4a6a]">You're all caught up!</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">No new notifications right now.</p>
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-all cursor-pointer relative ${
                  !item.read ? "bg-cyan-50/40" : "bg-white"
                }`}
              >
                {!item.read && (
                  <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-sm"></div>
                )}
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      size="large"
                      className={`shadow-sm flex items-center justify-center border border-white ${
                        item.type === "urgent" ? "bg-red-50 text-red-500" : 
                        item.type === "leave" ? "bg-cyan-50 text-cyan-600" : 
                        "bg-blue-50 text-blue-500"
                      }`}
                    >
                      {getIcon(item.type)}
                    </Avatar>
                  }
                  title={
                    <div className="flex flex-col w-full relative -top-0.5">
                      <div className="flex justify-between items-center w-full mb-0.5">
                        <span className="text-[14px] font-bold text-[#1e4a6a] tracking-tight">
                          {item.senderName}
                        </span>
                        <span className="text-[10px] text-cyan-600/80 font-bold tracking-wide uppercase">
                          {dayjs(item.createdAt).fromNow(true)}
                        </span>
                      </div>
                    </div>
                  }
                  description={
                    <p className="text-[12.5px] text-gray-600 mt-0.5 line-clamp-2 leading-snug font-medium">
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
        <div 
          onClick={() => {
            setPopoverOpen(false);
            navigate("/notifications");
          }}
          className="border-t bg-gray-50/50 p-3 text-center text-xs text-cyan-600 font-medium cursor-pointer hover:bg-cyan-50 transition-colors"
        >
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
          
          <AutoComplete
            options={searchOptions}
            onSelect={handleSelect}
            onSearch={handleSearchInput}
            value={searchText}
            className="hidden sm:flex w-48 lg:w-64"
            classNames={{ popup: { root: "rounded-xl shadow-xl border border-gray-100 p-1" } }}
          >
            <Input
              placeholder="Search features..."
              prefix={<SearchOutlined className="text-gray-400 mr-1" />}
              className="rounded-full bg-gray-50 hover:bg-gray-100 focus:bg-white border-gray-200 focus:border-cyan-500 py-1.5 transition-all shadow-inner"
              onPressEnter={(e) => {
                if (searchOptions.length > 0) {
                  handleSelect(searchOptions[0].value, searchOptions[0]);
                } else {
                  handleSearch(e.target.value);
                }
              }}
            />
          </AutoComplete>

          <Popover
            content={notificationContent}
            trigger="click"
            placement="bottomRight"
            open={popoverOpen}
            onOpenChange={handleOpenChange}
            styles={{ body: { padding: 0, borderRadius: '12px', overflow: 'hidden' } }}
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
            <Avatar 
              style={{ backgroundColor: getAvatarColor(user?.name || user?.email) }}
              className="text-white font-medium flex items-center justify-center shadow-md border-2 border-white text-lg"
            >
              {getInitials(user?.name || user?.email)}
            </Avatar>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-bold text-[#1e4a6a] leading-none">
                {user?.name || user?.email || "User"}
              </span>
              <span className="text-[11px] text-cyan-600 font-bold uppercase tracking-wider leading-tight mt-1">
                {user?.role || "user"}
              </span>
            </div>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
}