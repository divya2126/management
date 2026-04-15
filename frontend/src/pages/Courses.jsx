import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import api from "../services/api";

const { Option } = Select;

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      const [coursesRes, deptsRes] = await Promise.all([
        api.get("/management/courses"),
        api.get("/management/departments"),
      ]);
      setCourses(coursesRes.data);
      setDepartments(deptsRes.data);
    } catch (err) {
      message.error("Failed to fetch data");
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      name: record.name,
      code: record.code,
      department: record.department?._id || record.department,
      totalSemesters: record.totalSemesters,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingRecord) {
        await api.put(`/management/courses/${editingRecord._id}`, values);
        message.success("Course updated successfully");
      } else {
        await api.post("/management/courses", values);
        message.success("Course added successfully");
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (err) {
      message.error(err.response?.data?.message || "Error saving course");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/management/courses/${id}`);
      message.success("Course deleted");
      fetchData();
    } catch (err) {
      message.error("Failed to delete course");
    }
  };

  const columns = [
    { title: "Course Name", dataIndex: "name", key: "name", className: "font-medium text-gray-700" },
    { title: "Code", dataIndex: "code", key: "code", render: (text) => <span className="font-mono bg-indigo-50 text-indigo-600 px-2 py-1 rounded inline-block">{text}</span> },
    { title: "Department", dataIndex: "department", key: "department", render: (dept) => dept?.name || "Unknown" },
    { title: "Total Semesters", dataIndex: "totalSemesters", key: "totalSemesters" },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
          <Popconfirm title="Delete this course?" onConfirm={() => handleDelete(record._id)}>
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Courses</h1>
          <p className="text-gray-500 mt-1">Manage academic programs (e.g., B.Tech, MBA)</p>
        </div>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={openCreate}>
          Add Course
        </Button>
      </div>

      <div className="bg-white p-0 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Table dataSource={courses} columns={columns} rowKey="_id" pagination={{ pageSize: 8 }} />
      </div>

      <Modal
        title={<h3 className="text-lg font-bold">{editingRecord ? "Edit Course" : "Add New Course"}</h3>}
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
        footer={null}
        centered
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
          <Form.Item name="name" label="Course Name" rules={[{ required: true, message: "Required" }]}>
            <Input size="large" placeholder="e.g. B.Tech Computer Science" />
          </Form.Item>
          <Form.Item name="code" label="Course Code" rules={[{ required: true, message: "Required" }]}>
            <Input size="large" placeholder="e.g. BTECH-CSE" className="uppercase" />
          </Form.Item>
          <Form.Item name="department" label="Department" rules={[{ required: true, message: "Required" }]}>
            <Select size="large" placeholder="Select a department">
              {departments.map((d) => <Option key={d._id} value={d._id}>{d.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="totalSemesters" label="Total Semesters" rules={[{ required: true, message: "Required" }]}>
            <InputNumber size="large" min={1} max={12} className="w-full" placeholder="e.g. 8" />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" loading={loading} className="w-full mt-2">
            {editingRecord ? "Update Course" : "Save Course"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
