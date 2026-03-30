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

const { Header } = Layout;

export default function Topbar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  const menuItems = [
    {
      key: '1',
      icon: <LogoutOutlined />,
      label: 'Sign out',
      onClick: handleLogout
    }
  ];

  return (
    <Header className="bg-white shadow-sm flex justify-between items-center px-6 border-b"
            style={{ background: "#ffffff", height: "70px" }}>
      
      {/* Left side: Hamburger */}
      <div className="flex items-center gap-4">
        <button onClick={() => setCollapsed(!collapsed)} className="text-xl text-gray-600 hover:text-gray-900 transition mt-1">
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6">
        
        <div className="flex items-center gap-4 text-gray-500 mt-2">
          <SearchOutlined className="text-xl cursor-pointer hover:text-blue-500 transition" />
          <div className="relative cursor-pointer hover:text-blue-500 transition mr-2">
            <BellOutlined className="text-xl" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200"></div>

        {/* User Profile Area */}
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
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
