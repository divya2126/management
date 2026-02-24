import { Layout, Avatar } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

export default function Topbar({ collapsed, setCollapsed }) {
  return (
    <Header className="bg-white shadow-sm flex justify-between items-center px-6">

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="text-xl"
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </button>

      <div className="flex items-center gap-5">
        <BellOutlined className="text-lg" />
        <Avatar className="bg-blue-500">AD</Avatar>
      </div>

    </Header>
  );
}