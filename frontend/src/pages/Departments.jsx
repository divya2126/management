import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "../services/api";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/management/departments");
      setDepartments(res.data);
    } catch (err) {
      message.error("Failed to fetch departments");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAdd = async (values) => {
    setLoading(true);
    try {
      await api.post("/management/departments", values);
      message.success("Department added successfully");
      setIsModalOpen(false);
      form.resetFields();
      fetchDepartments();
    } catch (err) {
      message.error(err.response?.data?.message || "Error adding department");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/management/departments/${id}`);
      message.success("Department deleted");
      fetchDepartments();
    } catch (err) {
      message.error("Failed to delete department");
    }
  };

  const columns = [
    { title: "Department Name", dataIndex: "name", key: "name", className: "font-medium text-gray-700" },
    { title: "Code", dataIndex: "code", key: "code", render: (text) => <span className="font-mono bg-blue-50 text-blue-600 px-2 py-1 rounded inline-block">{text}</span> },
    { title: "Description", dataIndex: "description", key: "description", className: "text-gray-500" },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Popconfirm title="Delete this department?" onConfirm={() => handleDelete(record._id)}>
          <Button danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Departments</h1>
          <p className="text-gray-500 mt-1">Manage the academic departments of your institution</p>
        </div>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Add Department
        </Button>
      </div>

      <div className="bg-white p-0 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Table dataSource={departments} columns={columns} rowKey="_id" pagination={{ pageSize: 8 }} className="custom-table" />
      </div>

      <Modal
        title={<h3 className="text-lg font-bold">Add New Department</h3>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleAdd} className="mt-4">
          <Form.Item name="name" label="Department Name" rules={[{ required: true, message: "Required" }]}>
            <Input size="large" placeholder="e.g. Computer Science Engineering" />
          </Form.Item>
          <Form.Item name="code" label="Department Code" rules={[{ required: true, message: "Required" }]}>
            <Input size="large" placeholder="e.g. CSE" className="uppercase" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Optional details..." />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" loading={loading} className="w-full mt-2">
            Save Department
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
