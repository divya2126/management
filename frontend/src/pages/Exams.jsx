import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Form, Input, Select, DatePicker, Button, Table, Tag, Modal,
  message, Popconfirm, InputNumber, Space, Badge, Tooltip
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined,
  TrophyOutlined, BookOutlined, CheckCircleOutlined,
  ExclamationCircleOutlined, StopOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../services/api';

const { Option } = Select;

const EXAM_TYPE_COLORS = {
  "Mid-Term": "blue",
  "End-Term": "volcano",
  "Internal": "cyan",
  "Practical": "green",
  "Quiz": "gold",
};

const STATUS_CONFIG = {
  "Scheduled": { color: "processing", icon: <ClockCircleOutlined /> },
  "Ongoing":   { color: "warning",    icon: <ExclamationCircleOutlined /> },
  "Completed": { color: "success",    icon: <CheckCircleOutlined /> },
  "Cancelled": { color: "error",      icon: <StopOutlined /> },
};

export default function Exams() {
  const { user } = useAuth();
  const canManage = user?.role === 'admin' || user?.role === 'hod';

  const [exams, setExams]       = useState([]);
  const [courses, setCourses]   = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading]   = useState(false);

  const [modalOpen, setModalOpen]   = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [saving, setSaving]         = useState(false);

  const [filterCourse, setFilterCourse]     = useState(null);
  const [filterStatus, setFilterStatus]     = useState(null);
  const [filterSemester, setFilterSemester] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchExams();
    fetchDropdowns();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterCourse)   params.courseId  = filterCourse;
      if (filterStatus)   params.status    = filterStatus;
      if (filterSemester) params.semester  = filterSemester;
      const { data } = await api.get('/exams', { params });
      setExams(data.data);
    } catch (err) {
      message.error('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [coursesRes, subjectsRes] = await Promise.all([
        api.get('/management/courses'),
        api.get('/management/subjects'),
      ]);
      setCourses(coursesRes.data);
      setSubjects(subjectsRes.data);
    } catch (err) {
      console.error('Dropdown fetch error:', err);
    }
  };

  const openCreate = () => {
    setEditingExam(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (exam) => {
    setEditingExam(exam);
    form.setFieldsValue({
      title:    exam.title,
      course:   exam.course?._id,
      subject:  exam.subject?._id,
      examType: exam.examType,
      date:     dayjs(exam.date),
      startTime: exam.startTime,
      duration: exam.duration,
      venue:    exam.venue,
      maxMarks: exam.maxMarks,
      semester: exam.semester,
      status:   exam.status,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/exams/${id}`);
      message.success('Exam deleted');
      fetchExams();
    } catch (err) {
      message.error('Failed to delete exam');
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const payload = {
        ...values,
        date: values.date.toISOString(),
      };

      if (editingExam) {
        await api.put(`/exams/${editingExam._id}`, payload);
        message.success('Exam updated successfully');
      } else {
        await api.post('/exams', payload);
        message.success('Exam scheduled successfully');
      }

      setModalOpen(false);
      fetchExams();
    } catch (err) {
      if (err?.errorFields) return; // validation error, don't show toast
      message.error('Failed to save exam');
    } finally {
      setSaving(false);
    }
  };

  // Stats cards
  const total     = exams.length;
  const scheduled = exams.filter(e => e.status === 'Scheduled').length;
  const ongoing   = exams.filter(e => e.status === 'Ongoing').length;
  const completed = exams.filter(e => e.status === 'Completed').length;

  const columns = [
    {
      title: 'Exam Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <p className="font-semibold text-gray-800">{text}</p>
          <Tag color={EXAM_TYPE_COLORS[record.examType]} className="mt-1 text-xs">
            {record.examType}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Course / Subject',
      key: 'course',
      render: (_, record) => (
        <div>
          <p className="text-sm font-medium text-blue-700">{record.course?.name || '—'}</p>
          <p className="text-xs text-gray-500">{record.subject?.name || '—'}</p>
        </div>
      ),
    },
    {
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
      align: 'center',
      render: (sem) => <Tag color="purple">Sem {sem}</Tag>,
    },
    {
      title: 'Date & Time',
      key: 'datetime',
      render: (_, record) => (
        <div>
          <p className="font-medium text-gray-800 flex items-center gap-1">
            <CalendarOutlined className="text-blue-500" />
            {dayjs(record.date).format('DD MMM YYYY')}
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <ClockCircleOutlined />
            {record.startTime} &nbsp;·&nbsp; {record.duration} min
          </p>
        </div>
      ),
    },
    {
      title: 'Venue',
      dataIndex: 'venue',
      key: 'venue',
      render: (venue) => (
        <span className="flex items-center gap-1 text-gray-600">
          <EnvironmentOutlined className="text-red-400" /> {venue}
        </span>
      ),
    },
    {
      title: 'Max Marks',
      dataIndex: 'maxMarks',
      key: 'maxMarks',
      align: 'center',
      render: (marks) => (
        <span className="flex items-center justify-center gap-1 font-semibold text-amber-600">
          <TrophyOutlined /> {marks}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const cfg = STATUS_CONFIG[status] || {};
        return (
          <Badge
            status={cfg.color}
            text={
              <span className="flex items-center gap-1 text-sm">
                {cfg.icon} {status}
              </span>
            }
          />
        );
      },
    },
    canManage && {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEdit(record)}
              className="text-blue-500 hover:text-blue-700"
            />
          </Tooltip>
          <Popconfirm
            title="Delete this exam?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record._id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button type="text" icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ].filter(Boolean);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOutlined className="text-indigo-600" /> Examination Schedule
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {canManage ? 'Schedule and manage all examinations.' : 'View upcoming and past exams for your course.'}
          </p>
        </div>
        {canManage && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={openCreate}
            style={{ background: '#4f46e5' }}
          >
            Schedule Exam
          </Button>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Exams',  value: total,     color: '#4f46e5', bg: '#eef2ff' },
          { label: 'Scheduled',   value: scheduled,  color: '#2563eb', bg: '#dbeafe' },
          { label: 'Ongoing',     value: ongoing,    color: '#d97706', bg: '#fef3c7' },
          { label: 'Completed',   value: completed,  color: '#16a34a', bg: '#dcfce7' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="rounded-xl p-4 shadow-sm border border-gray-100" style={{ background: bg }}>
            <p className="text-sm font-medium" style={{ color }}>{label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-5 flex flex-wrap gap-3">
        <Select
          allowClear
          placeholder="Filter by Course"
          style={{ width: 220 }}
          onChange={(v) => setFilterCourse(v)}
        >
          {courses.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)}
        </Select>
        <Select
          allowClear
          placeholder="Filter by Status"
          style={{ width: 180 }}
          onChange={(v) => setFilterStatus(v)}
        >
          {['Scheduled', 'Ongoing', 'Completed', 'Cancelled'].map(s => (
            <Option key={s} value={s}>{s}</Option>
          ))}
        </Select>
        <Select
          allowClear
          placeholder="Semester"
          style={{ width: 150 }}
          onChange={(v) => setFilterSemester(v)}
        >
          {[1,2,3,4,5,6,7,8].map(n => <Option key={n} value={n}>Semester {n}</Option>)}
        </Select>
        <Button onClick={fetchExams} type="default">Apply Filters</Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table
          dataSource={exams}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (total) => `${total} exams` }}
          locale={{ emptyText: 'No exams scheduled yet.' }}
          rowClassName="hover:bg-indigo-50 transition-colors"
        />
      </div>

      {/* Create / Edit Modal */}
      <Modal
        title={
          <span className="flex items-center gap-2 text-lg font-bold">
            <CalendarOutlined className="text-indigo-600" />
            {editingExam ? 'Edit Exam' : 'Schedule New Exam'}
          </span>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        confirmLoading={saving}
        okText={editingExam ? 'Save Changes' : 'Schedule Exam'}
        okButtonProps={{ style: { background: '#4f46e5' } }}
        width={680}
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">

            <Form.Item name="title" label="Exam Title" rules={[{ required: true }]} className="md:col-span-2">
              <Input placeholder="e.g., Mid-Term Examination — Data Structures" />
            </Form.Item>

            <Form.Item name="course" label="Course" rules={[{ required: true }]}>
              <Select placeholder="Select Course" showSearch optionFilterProp="children">
                {courses.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)}
              </Select>
            </Form.Item>

            <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
              <Select placeholder="Select Subject" showSearch optionFilterProp="children">
                {subjects.map(s => <Option key={s._id} value={s._id}>{s.name}</Option>)}
              </Select>
            </Form.Item>

            <Form.Item name="examType" label="Exam Type" rules={[{ required: true }]}>
              <Select placeholder="Select Type">
                {['Mid-Term', 'End-Term', 'Internal', 'Practical', 'Quiz'].map(t => (
                  <Option key={t} value={t}>{t}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="semester" label="Semester" rules={[{ required: true }]}>
              <Select placeholder="Select Semester">
                {[1,2,3,4,5,6,7,8].map(n => <Option key={n} value={n}>Semester {n}</Option>)}
              </Select>
            </Form.Item>

            <Form.Item name="date" label="Exam Date" rules={[{ required: true }]}>
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item name="startTime" label="Start Time" rules={[{ required: true }]}>
              <Input placeholder="e.g., 10:00 AM" />
            </Form.Item>

            <Form.Item name="duration" label="Duration (minutes)" rules={[{ required: true }]}>
              <InputNumber min={30} max={300} step={30} className="w-full" />
            </Form.Item>

            <Form.Item name="maxMarks" label="Maximum Marks" rules={[{ required: true }]}>
              <InputNumber min={10} max={200} className="w-full" />
            </Form.Item>

            <Form.Item name="venue" label="Venue / Room" rules={[{ required: true }]} className="md:col-span-2">
              <Input placeholder="e.g., Exam Hall A, Block B Room 301" />
            </Form.Item>

            {editingExam && (
              <Form.Item name="status" label="Status" className="md:col-span-2">
                <Select>
                  {['Scheduled', 'Ongoing', 'Completed', 'Cancelled'].map(s => (
                    <Option key={s} value={s}>{s}</Option>
                  ))}
                </Select>
              </Form.Item>
            )}

          </div>
        </Form>
      </Modal>
    </div>
  );
}
