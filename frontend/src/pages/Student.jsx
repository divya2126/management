import { Button, Input, Table, Tag, Modal, Form, Select, message, Space, Popconfirm } from "antd";
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import api from "../services/api";

const { Option } = Select;

export default function Student() {
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchText, setSearchText]     = useState("");
  const [students, setStudents]         = useState([]);
  const [loading, setLoading]           = useState(false);
  const [form]                          = Form.useForm();

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get("/students");
      // API now returns { data: [], pagination: {} } — extract the array
      setStudents(data?.data || data);
    } catch {
      message.error("Failed to fetch students");
    }
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchText.toLowerCase())
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
      age:        record.age,
      department: record.department,
      status:     record.status,
      fatherName: record.fatherName,
      motherName: record.motherName,
      class10Marks: record.class10Marks,
      class12Marks: record.class12Marks,
    });
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingRecord) {
        await api.put(`/students/${editingRecord._id}`, values);
        message.success("Student updated successfully");
      } else {
        await api.post("/students", values);
        message.success("Student added successfully");
      }

      form.resetFields();
      setIsModalOpen(false);
      fetchStudents();
    } catch (err) {
      if (err?.errorFields) return;
      message.error(err?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await api.delete(`/students/${id}`);
      message.success("Student deleted");
      fetchStudents();
    } catch {
      message.error("Failed to delete student");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Age", dataIndex: "age" },
    { title: "Department", dataIndex: "department", render: (dept) => <Tag color="blue">{dept}</Tag> },
    { title: "Email", dataIndex: "email" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) =>
        status === "Active" ? <Tag color="green">Active</Tag> : <Tag color="orange">On Leave</Tag>,
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} onClick={() => openEdit(record)}>Edit</Button>
          <Popconfirm title="Delete this student?" onConfirm={() => deleteStudent(record._id)}>
            <Button danger icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>Students</h1>
      <p style={{ color: "gray", marginBottom: "20px" }}>Manage all students</p>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search Students..."
          style={{ width: "250px" }}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Add Student
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredStudents} rowKey="_id" pagination={{ pageSize: 5 }} />

      <Modal
        title={editingRecord ? "Edit Student" : "Add Student"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
        confirmLoading={loading}
        okText={editingRecord ? "Save Changes" : "Save"}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Required" }]}>
              <Input placeholder="Enter full name" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Required" }, { type: "email", message: "Invalid email" }]}
            >
              <Input placeholder="Enter email" disabled={!!editingRecord} />
            </Form.Item>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <Form.Item name="age" label="Age">
              <Input type="number" placeholder="Enter age" />
            </Form.Item>
            <Form.Item name="department" label="Department" rules={[{ required: true, message: "Required" }]}>
              <Select placeholder="Select department">
                <Option value="Computer Science">Computer Science</Option>
                <Option value="Mathematics">Mathematics</Option>
                <Option value="Physics">Physics</Option>
                <Option value="Chemistry">Chemistry</Option>
              </Select>
            </Form.Item>
          </div>

          {editingRecord && (
            <Form.Item name="status" label="Status">
              <Select>
                <Option value="Active">Active</Option>
                <Option value="On Leave">On Leave</Option>
              </Select>
            </Form.Item>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <Form.Item name="fatherName" label="Father Name">
              <Input placeholder="Father name" />
            </Form.Item>
            <Form.Item name="motherName" label="Mother Name">
              <Input placeholder="Mother name" />
            </Form.Item>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <Form.Item name="class10Marks" label="Class 10 Marks">
              <Input placeholder="e.g. 95%" />
            </Form.Item>
            <Form.Item name="class12Marks" label="Class 12 Marks">
              <Input placeholder="e.g. 90%" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}