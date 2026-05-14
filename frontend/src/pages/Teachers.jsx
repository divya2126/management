import { Button, Input, Table, Tag, Modal, Form, Select, message, Space, Popconfirm } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";

const { Option } = Select;

export default function Teachers() {
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const location                        = useLocation();
  const [searchText, setSearchText]     = useState(location.state?.searchQuery || "");
  const [teachers, setTeachers]         = useState([]);
  const [loading, setLoading]           = useState(false);
  const [form]                          = Form.useForm();

  // Academic Profile State
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedTeacherForProfile, setSelectedTeacherForProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileForm] = Form.useForm();
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => { 
    fetchTeachers(); 
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const [subRes, deptRes] = await Promise.all([
        api.get("/management/subjects"),
        api.get("/management/departments")
      ]);
      setSubjects(subRes.data);
      setDepartments(deptRes.data);
    } catch {}
  };

  useEffect(() => {
    if (location.state?.searchQuery) {
      setSearchText(location.state.searchQuery);
    }
  }, [location.state]);

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

  const openProfile = async (record) => {
    setSelectedTeacherForProfile(record);
    profileForm.resetFields();
    setProfileModalOpen(true);
    setProfileLoading(true);
    try {
      const { data } = await api.get(`/teacher-profiles/${record._id}`);
      profileForm.setFieldsValue({
        department: data.data.department?._id || data.data.department,
        subjectsCanTeach: data.data.subjectsCanTeach.map(s => s._id || s),
        maxLecturesPerWeek: data.data.maxLecturesPerWeek || 20,
        unavailableDays: data.data.unavailableDays || []
      });
    } catch {
      message.error("Failed to load academic profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileSave = async () => {
    try {
      const values = await profileForm.validateFields();
      setProfileLoading(true);
      await api.post(`/teacher-profiles/upsert`, {
        teacherId: selectedTeacherForProfile._id,
        ...values
      });
      message.success("Academic Profile saved successfully");
      setProfileModalOpen(false);
    } catch (e) {
      if (e?.errorFields) return;
      message.error("Failed to save profile");
    } finally {
      setProfileLoading(false);
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
          <Button icon={<SettingOutlined />} onClick={() => openProfile(record)} title="Configure Academic Profile">
            Profile
          </Button>
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
          value={searchText}
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

      {/* Academic Profile Modal */}
      <Modal
        title={`⚙️ Configure Academic Profile - ${selectedTeacherForProfile?.name}`}
        open={profileModalOpen}
        onOk={handleProfileSave}
        onCancel={() => setProfileModalOpen(false)}
        confirmLoading={profileLoading}
        okText="Save Academic Profile"
        okButtonProps={{ style: { background: "#4f46e5" } }}
        destroyOnClose
      >
        <Form form={profileForm} layout="vertical" className="mt-4">
          <Form.Item name="department" label="Department" rules={[{ required: true, message: "Select department" }]}>
            <Select placeholder="Select department">
              {departments.map(d => <Option key={d._id} value={d._id}>{d.name}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item name="subjectsCanTeach" label="Qualified Subjects (Can Teach)" rules={[{ required: true, message: "Select at least one subject" }]}>
            <Select mode="multiple" placeholder="Select subjects this teacher can teach" optionFilterProp="children" showSearch>
              {subjects.map(s => <Option key={s._id} value={s._id}>{s.name} ({s.code})</Option>)}
            </Select>
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="maxLecturesPerWeek" label="Max Lectures / Week" rules={[{ required: true }]}>
              <Input type="number" min={1} max={40} />
            </Form.Item>

            <Form.Item name="unavailableDays" label="Unavailable Days">
              <Select mode="multiple" placeholder="E.g. Friday">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(d => (
                  <Option key={d} value={d}>{d}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}