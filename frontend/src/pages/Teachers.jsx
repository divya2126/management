import { Button, Input, Table, Tag, Modal, Form, Select, message, Space, Popconfirm } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import api from "../services/api";

const { Option } = Select;

export default function Teachers() {
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchText, setSearchText]     = useState("");
  const [teachers, setTeachers]         = useState([]);
  const [loading, setLoading]           = useState(false);
  const [form]                          = Form.useForm();

  useEffect(() => { fetchTeachers(); }, []);

  const fetchTeachers = async () => {
    try {
      const { data } = await api.get("/teachers");
      setTeachers(data);
    } catch {
      message.error("Failed to fetch teachers");
    }
  };

  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const openCreate = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      name:       record.name,
      email:      record.email,
      role:       record.role,
      department: record.department,
      status:     record.status,
    });
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingRecord) {
        await api.put(`/teachers/${editingRecord._id}`, values);
        message.success("Teacher updated successfully");
      } else {
        await api.post("/teachers", { ...values, status: "Active" });
        message.success("Teacher/HOD added. They can login with default password 'Teacher@123'");
      }

      form.resetFields();
      setIsModalOpen(false);
      fetchTeachers();
    } catch (err) {
      if (err?.errorFields) return;
      message.error(err?.response?.data?.message || "Failed to save teacher");
    } finally {
      setLoading(false);
    }
  };

  const deleteTeacher = async (id) => {
    try {
      await api.delete(`/teachers/${id}`);
      message.success("Teacher deleted");
      fetchTeachers();
    } catch {
      message.error("Failed to delete teacher");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Department", dataIndex: "department", render: (dept) => <Tag color="blue">{dept}</Tag> },
    { title: "Email", dataIndex: "email" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) =>
        status === "Active" ? <Tag color="green">Active</Tag> : <Tag color="orange">On Leave</Tag>,
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (role) =>
        role === "hod" ? <Tag color="purple">HOD</Tag> : <Tag color="cyan">Professor</Tag>,
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} onClick={() => openEdit(record)}>
            Edit
          </Button>
          <Popconfirm title="Delete this teacher?" onConfirm={() => deleteTeacher(record._id)}>
            <Button danger icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>Staff Management</h1>
      <p style={{ color: "gray", marginBottom: "20px" }}>Add and manage Professors and HODs</p>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search staff..."
          style={{ width: "250px" }}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Add Staff Member
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredTeachers} rowKey="_id" pagination={{ pageSize: 5 }} />

      <Modal
        title={editingRecord ? "Edit Staff Member" : "Add Staff Member"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
        confirmLoading={loading}
        okText={editingRecord ? "Save Changes" : "Auto-Create Login"}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Please enter staff name" }]}>
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item name="role" label="Hierarchy Role" rules={[{ required: true, message: "Please select their system role" }]}>
            <Select placeholder="Select role">
              <Option value="teacher">Professor</Option>
              <Option value="hod">HOD (Head of Department)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Enter email" }, { type: "email", message: "Invalid email" }]}
          >
            <Input placeholder="Enter email" disabled={!!editingRecord} />
          </Form.Item>

          <Form.Item name="department" label="Department" rules={[{ required: true, message: "Select department" }]}>
            <Select placeholder="Select department">
              <Option value="Computer Science">Computer Science</Option>
              <Option value="Mathematics">Mathematics</Option>
              <Option value="Physics">Physics</Option>
              <Option value="Chemistry">Chemistry</Option>
            </Select>
          </Form.Item>

          {editingRecord && (
            <Form.Item name="status" label="Status">
              <Select>
                <Option value="Active">Active</Option>
                <Option value="On Leave">On Leave</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}