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

import { useState } from "react";

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

  const [teachers, setTeachers] = useState([
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
  ]);

  const [form] = Form.useForm();

  /* SEARCH FILTER */

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchText.toLowerCase())
  );

  /* DELETE TEACHER */

  const deleteTeacher = (key) => {
    setTeachers(teachers.filter((teacher) => teacher.key !== key));
    message.success("Teacher deleted");
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
            onClick={() => deleteTeacher(record.key)}
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
        key: Date.now(),
        name: values.name,
        department: values.department,
        email: values.email,
        status: "Active",
      };

      setTeachers((prev) => [...prev, newTeacher]);

      message.success("Teacher added successfully");

      form.resetFields();
      setIsModalOpen(false);

    } catch (error) {

      console.log(error);

    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
        Teachers
      </h1>

      <p style={{ color: "gray", marginBottom: "20px" }}>
        Manage all teachers and departments
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
          placeholder="Search teachers..."
          style={{ width: "250px" }}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showModal}
        >
          Add Teacher
        </Button>

      </div>

      {/* TABLE */}

      <Table
        columns={columns}
        dataSource={filteredTeachers}
        rowKey="key"
        pagination={{ pageSize: 5 }}
      />

      {/* ADD TEACHER MODAL */}

      <Modal
        title="Add Teacher"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
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
              { required: true, message: "Please enter teacher name" }
            ]}
          >
            <Input placeholder="Enter full name" />
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