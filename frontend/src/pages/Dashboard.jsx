import { useEffect } from "react";
import api from "../services/api";
import { Button, Input, Table, Tag } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";

const columns = [
  {
    title: "Department Head",
    dataIndex: "name",
  },
  {
    title: "Department",
    dataIndex: "department",
    render: (dept) => <Tag color="blue">{dept}</Tag>,
  },
  {
    title: "Contact",
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
    name: "Dr. Sarah Adams",
    department: "Computer Science",
    email: "s.adams@college.edu",
    status: "Active",
  },
  {
    key: 2,
    name: "Dr. Michael Chen",
    department: "Mathematics",
    email: "m.chen@college.edu",
    status: "Active",
  },
  {
    key: 3,
    name: "Prof. Julia Waters",
    department: "Physics",
    email: "j.waters@college.edu",
    status: "On Leave",
  },
];

export default function Dashboard() {

  // ⭐ Protected API call (runs when page loads)
  useEffect(() => {

    const getProfile = async () => {
      try {

        // interceptor automatically adds token
        const res = await api.get("/auth/profile");

        console.log("Logged User:", res.data);

      } catch (err) {
        console.log("Unauthorized user");
      }
    };

    getProfile();

  }, []);

  return (
    <div>

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold mb-2">Department Heads</h1>
      <p className="text-gray-500 mb-6">
        Central management for college HODs and departments.
      </p>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white rounded-2xl shadow-sm p-5 border">
          <p className="text-gray-500">Total HODs</p>
          <h2 className="text-2xl font-bold">24</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 border">
          <p className="text-gray-500">Total Teachers</p>
          <h2 className="text-2xl font-bold">142</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 border">
          <p className="text-gray-500">Total Students</p>
          <h2 className="text-2xl font-bold">2850</h2>
        </div>

      </div>

      {/* SEARCH + BUTTON */}
      <div className="bg-white rounded-2xl shadow-sm p-4 border">

        <div className="flex justify-between mb-4">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search department..."
            className="w-72"
          />

          <Button type="primary" icon={<PlusOutlined />}>
            Add User
          </Button>
        </div>

        {/* TABLE */}
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 5 }}
        />

      </div>

    </div>
  );
}