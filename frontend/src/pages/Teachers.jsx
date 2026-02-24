import { Button, Input, Table, Tag } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Department",
    dataIndex: "department",
    render: (dept) => <Tag color="blue">{dept}</Tag>,
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (status) =>
      status === "Active" ? (
        <Tag color="green">Active</Tag>
      ) : (
        <Tag color="orange">On Leave</Tag>
      ),
  },
];

const data = [
  {
    key: 1,
    name: "John Smith",
    department: "Computer Science",
    email: "john@college.edu",
    status: "Active",
  },
  {
    key: 2,
    name: "Maria Lee",
    department: "Mathematics",
    email: "maria@college.edu",
    status: "Active",
  },
  {
    key: 3,
    name: "David Kim",
    department: "Physics",
    email: "david@college.edu",
    status: "On Leave",
  },
];

export default function Teachers() {
  return (
    <div>
      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-2">Teachers</h1>
      <p className="text-gray-500 mb-6">
        Manage all teachers and departments.
      </p>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border rounded-2xl shadow-sm p-5">
          <p className="text-gray-500">Total Teachers</p>
          <h2 className="text-3xl font-bold">142</h2>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-5">
          <p className="text-gray-500">Active</p>
          <h2 className="text-3xl font-bold">130</h2>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-5">
          <p className="text-gray-500">On Leave</p>
          <h2 className="text-3xl font-bold">12</h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm p-4 border">
        <div className="flex justify-between mb-4">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search teachers..."
            className="w-72"
          />

          <Button type="primary" icon={<PlusOutlined />}>
            Add Teacher
          </Button>
        </div>

        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  );
}