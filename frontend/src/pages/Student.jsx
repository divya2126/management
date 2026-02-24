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

export default function Student() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Students</h1>

      <div className="bg-white p-4 rounded-xl shadow">
        <div className="flex justify-between mb-4">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search teachers..."
            className="w-72"
          />

          <Button type="primary" icon={<PlusOutlined />}>
            Add student
          </Button>
        </div>

        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  );
}