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

import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined
} from "@ant-design/icons";

import { useState, useEffect } from "react";
import axios from "axios";

const { Option } = Select;

/* Upload configuration */

const uploadProps = {
  name: "file",
  action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",

  headers: {
    authorization: "authorization-text",
  },

  onChange(info) {

    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }

    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    }

    if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
};


export default function Teachers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const { data } = await axios.get("http://localhost:5001/api/teachers");
      setTeachers(data);
    } catch (error) {
      message.error("Failed to fetch teachers");
    }
  };

  const [form] = Form.useForm();

  /* SEARCH FILTER */

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchText.toLowerCase())
  );

  /* DELETE TEACHER */

  const deleteTeacher = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/teachers/${id}`);
      message.success("Teacher deleted");
      fetchTeachers();
    } catch (error) {
      message.error("Failed to delete teacher");
    }
  };

  /* TABLE COLUMNS */

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

    {
      title: "Action",
      render: (_, record) => (
        <Space>

          <Button
            type="primary"
            icon={<EditOutlined />}
          >
            Edit
          </Button>

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteTeacher(record._id)}
          >
            Delete
          </Button>

        </Space>
      ),
    },
  ];

  /* OPEN MODAL */

  const showModal = () => {
    setIsModalOpen(true);
  };

  /* CLOSE MODAL */

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  /* ADD TEACHER */

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const newTeacher = {
        name: values.name,
        department: values.department,
        email: values.email,
        role: values.role, // Added role
        status: "Active",
      };

      await axios.post("http://localhost:5001/api/teachers", newTeacher);
      message.success("Teacher/HOD added successfully. They can login with default password 'Teacher@123'");

      form.resetFields();
      setIsModalOpen(false);
      fetchTeachers();

    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        message.error(error.response.data.message);
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
        Staff Management
      </h1>

      <p style={{ color: "gray", marginBottom: "20px" }}>
        Add and manage Professors and HODs
      </p>

      {/* SEARCH + ADD BUTTON */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px"
        }}
      >

        <Input
          prefix={<SearchOutlined />}
          placeholder="Search staff..."
          style={{ width: "250px" }}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showModal}
        >
          Add Staff Member
        </Button>

      </div>

      {/* TABLE */}

      <Table
        columns={columns}
        dataSource={filteredTeachers}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />

      {/* ADD TEACHER MODAL */}

      <Modal
        title="Add Staff Member"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Auto-Create Login"
      >

        <Form form={form} layout="vertical">

          {/* Upload Button */}

          <Form.Item label="Profile Photo">

            <Upload {...uploadProps}>

              <Button icon={<UploadOutlined />}>
                Click to Upload
              </Button>

            </Upload>

          </Form.Item>

          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: "Please enter staff name" }
            ]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Hierarchy Role"
            rules={[
              { required: true, message: "Please select their system role" }
            ]}
          >
            <Select placeholder="Select role">
              <Option value="teacher">Professor</Option>
              <Option value="hod">HOD (Head of Department)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Enter email" },
              { type: "email", message: "Invalid email" }
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            name="department"
            label="Department"
            rules={[
              { required: true, message: "Select department" }
            ]}
          >

            <Select placeholder="Select department">

              <Option value="Computer Science">
                Computer Science
              </Option>

              <Option value="Mathematics">
                Mathematics
              </Option>

              <Option value="Physics">
                Physics
              </Option>

              <Option value="Chemistry">
                Chemistry
              </Option>

            </Select>

          </Form.Item>

        </Form>

      </Modal>

    </div>
  );
}