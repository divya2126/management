import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Popconfirm, Tag } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "../services/api";

const { Option } = Select;

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      const [subsRes, coursesRes] = await Promise.all([
        api.get("/management/subjects"),
        api.get("/management/courses")
      ]);
      setSubjects(subsRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      message.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (values) => {
    setLoading(true);
    try {
      await api.post("/management/subjects", values);
      message.success("Subject added successfully");
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (err) {
      message.error(err.response?.data?.message || "Error adding subject");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/management/subjects/${id}`);
      message.success("Subject deleted");
      fetchData();
    } catch (err) {
      message.error("Failed to delete subject");
    }
  };

  const columns = [
    { title: "Subject Name", dataIndex: "name", key: "name", className: "font-medium text-gray-700" },
    { title: "Code", dataIndex: "code", key: "code", render: (text) => <span className="font-mono bg-teal-50 text-teal-600 px-2 py-1 rounded inline-block">{text}</span> },
    { title: "Course", dataIndex: "course", key: "course", render: (c) => c?.name || "Unknown" },
    { title: "Sem", dataIndex: "semester", key: "semester" },
    { 
      title: "Type", 
      dataIndex: "type", 
      key: "type",
      render: (type) => (
        <Tag color={type === "lab" ? "geekblue" : "purple"} className="uppercase font-semibold tracking-wide border-none px-2 rounded">
          {type}
        </Tag>
      )
    },
    { title: "Lectures/Week", dataIndex: "weeklyLectures", key: "weeklyLectures" },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Popconfirm title="Delete this subject?" onConfirm={() => handleDelete(record._id)}>
          <Button danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Subjects</h1>
          <p className="text-gray-500 mt-1">Manage subjects and weekly lecture allocations</p>
        </div>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Add Subject
        </Button>
      </div>

      <div className="bg-white p-0 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Table dataSource={subjects} columns={columns} rowKey="_id" pagination={{ pageSize: 8 }} />
      </div>

      <Modal
        title={<h3 className="text-lg font-bold">Add New Subject</h3>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleAdd} className="mt-4" initialValues={{ type: "theory", credits: 3 }}>
          <Form.Item name="name" label="Subject Name" rules={[{ required: true, message: "Required" }]}>
            <Input size="large" placeholder="e.g. Data Structures" />
          </Form.Item>
          
          <Form.Item name="code" label="Subject Code" rules={[{ required: true, message: "Required" }]}>
            <Input size="large" placeholder="e.g. CS201" className="uppercase" />
          </Form.Item>

          <Form.Item name="course" label="Course" rules={[{ required: true, message: "Required" }]}>
            <Select size="large" placeholder="Select a course">
              {courses.map((c) => (
                <Option key={c._id} value={c._id}>{c.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="semester" label="Semester" rules={[{ required: true, message: "Required" }]}>
              <InputNumber size="large" min={1} max={12} className="w-full" placeholder="e.g. 3" />
            </Form.Item>
            
            <Form.Item name="type" label="Type" rules={[{ required: true, message: "Required" }]}>
              <Select size="large">
                <Option value="theory">Theory</Option>
                <Option value="lab">Lab</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="credits" label="Credits" rules={[{ required: true }]}>
              <InputNumber size="large" min={1} max={6} className="w-full" />
            </Form.Item>
            
            <Form.Item 
              name="weeklyLectures" 
              label={
                <span>
                  Weekly Lectures 
                  <span className="text-xs text-blue-500 ml-2">(Used by Timetable Engine)</span>
                </span>
              } 
              rules={[{ required: true, message: "Required" }]}>
              <InputNumber size="large" min={1} max={10} className="w-full" placeholder="e.g. 4" />
            </Form.Item>
          </div>

          <Button type="primary" htmlType="submit" size="large" loading={loading} className="w-full mt-2">
            Save Subject
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
