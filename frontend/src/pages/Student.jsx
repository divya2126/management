import {
  Button,
  Input,
  Table,
  Tag,
  Modal,
  Form,
  Select,
  message,
  Space,
  Upload
} from "antd";
import { SearchOutlined, PlusOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import axios from "axios";

const { Option } = Select;

const uploadProps = {
  name: "file",
  action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
};

export default function Student() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [students, setStudents] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await axios.get("http://localhost:5001/api/students");
      setStudents(data);
    } catch (error) {
      message.error("Failed to fetch students");
    }
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/students/${id}`);
      message.success("Student deleted");
      fetchStudents();
    } catch (error) {
      message.error("Failed to delete student");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Age", dataIndex: "age" },
    {
      title: "Department",
      dataIndex: "department",
      render: (dept) => <Tag color="blue">{dept}</Tag>,
    },
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
          <Button danger icon={<DeleteOutlined />} onClick={() => deleteStudent(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await axios.post("http://localhost:5001/api/students", values);
      message.success("Student added successfully");
      form.resetFields();
      setIsModalOpen(false);
      fetchStudents();
    } catch (error) {
      if (error?.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (error.errorFields) {
        // Validation format error, ignore here
      } else {
        message.error("An error occurred");
      }
    }
  };

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
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Add Student
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredStudents} rowKey="_id" pagination={{ pageSize: 5 }} />

      <Modal title="Add Student" open={isModalOpen} onOk={handleOk} onCancel={() => { setIsModalOpen(false); form.resetFields(); }} okText="Save">
        <Form form={form} layout="vertical">
          <Form.Item label="Profile Photo">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Required" }]}>
              <Input placeholder="Enter full name" />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, message: "Required" }, { type: "email", message: "Invalid email" }]}>
              <Input placeholder="Enter email" />
            </Form.Item>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <Form.Item name="fatherName" label="Father Name">
              <Input placeholder="Father name" />
            </Form.Item>
            <Form.Item name="motherName" label="Mother Name">
              <Input placeholder="Mother name" />
            </Form.Item>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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