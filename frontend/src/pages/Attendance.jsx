import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Form, Select, DatePicker, Button, Table, Switch, message, Spin, Progress, Alert } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, BookOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../services/api';

const { Option } = Select;

// ─── Student View: Real attendance data from API ──────────────────────────────
function StudentAttendanceView() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/attendance/my');
        setData(res.data.data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Could not load your attendance records.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spin size="large" tip="Loading your attendance..." /></div>;

  if (error) return (
    <div className="p-6">
      <Alert
        message="Attendance Unavailable"
        description={error}
        type="warning"
        showIcon
      />
    </div>
  );

  if (!data) return null;

  const { overallPercentage, totalClasses, present, absent, perSubject, studentName } = data;

  const statusColor = overallPercentage === null ? '#6b7280'
    : overallPercentage >= 75 ? '#16a34a'
    : overallPercentage >= 60 ? '#d97706'
    : '#dc2626';

  const statusText = overallPercentage === null ? 'No records yet'
    : overallPercentage >= 75 ? 'Good Standing ✅'
    : overallPercentage >= 60 ? 'At Risk ⚠️'
    : 'Below Minimum ❌';

  const columns = [
    { title: 'Subject', dataIndex: 'subject', key: 'subject', className: 'font-medium' },
    {
      title: 'Attended',
      key: 'attended',
      render: (_, r) => `${r.present} / ${r.total}`,
    },
    {
      title: 'Percentage',
      key: 'percentage',
      render: (_, r) => (
        <Progress
          percent={r.percentage}
          size="small"
          strokeColor={r.percentage >= 75 ? '#16a34a' : r.percentage >= 60 ? '#d97706' : '#dc2626'}
        />
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, r) =>
        r.percentage >= 75
          ? <span className="text-green-600 font-semibold flex items-center gap-1"><CheckCircleOutlined /> Good</span>
          : <span className="text-red-500 font-semibold flex items-center gap-1"><CloseCircleOutlined /> Low</span>,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <BookOutlined className="text-indigo-600" /> My Attendance
      </h1>

      {/* Overall card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col md:flex-row gap-6 items-center">
        {/* Circle */}
        <div
          className="w-32 h-32 rounded-full border-4 flex items-center justify-center flex-shrink-0"
          style={{ borderColor: statusColor }}
        >
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: statusColor }}>
              {overallPercentage !== null ? `${overallPercentage}%` : '—'}
            </p>
            <p className="text-xs text-gray-400">Overall</p>
          </div>
        </div>
        {/* Summary */}
        <div>
          <p className="text-xl font-bold text-gray-800">{studentName}</p>
          <p className="text-lg font-semibold mt-1" style={{ color: statusColor }}>{statusText}</p>
          <div className="flex gap-6 mt-3 text-sm text-gray-600">
            <span>📅 Total Classes: <b>{totalClasses}</b></span>
            <span className="text-green-600">✅ Present: <b>{present}</b></span>
            <span className="text-red-500">❌ Absent: <b>{absent}</b></span>
          </div>
          {overallPercentage !== null && overallPercentage < 75 && (
            <p className="text-xs text-red-500 mt-2">
              ⚠️ Minimum required attendance is 75%. You need {Math.ceil((0.75 * totalClasses - present) / 0.25)} more classes.
            </p>
          )}
        </div>
      </div>

      {/* Per-subject table */}
      {perSubject?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-800">Subject-wise Breakdown</h2>
          </div>
          <Table
            dataSource={perSubject}
            columns={columns}
            rowKey="subject"
            pagination={false}
            size="middle"
          />
        </div>
      )}
    </div>
  );
}

// ─── Teacher / Admin / HOD View ───────────────────────────────────────────────
function TeacherAttendanceView() {
  const [form] = Form.useForm();
  const [courses, setCourses]   = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [loading, setLoading]   = useState(false);
  const [saving, setSaving]     = useState(false);

  useEffect(() => { fetchDropdowns(); }, []);

  const fetchDropdowns = async () => {
    try {
      const [coursesRes, subjectsRes, studentsRes] = await Promise.all([
        api.get('/management/courses'),
        api.get('/management/subjects'),
        api.get('/students'),
      ]);
      setCourses(coursesRes.data);
      setSubjects(subjectsRes.data);
      const allStudents = studentsRes.data?.data || studentsRes.data;
      setStudents(allStudents.filter(s => s.status === 'Active'));
    } catch {
      message.error('Failed to load initial data');
    }
  };

  const handleFetchAttendance = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const dateStr = values.date.format('YYYY-MM-DD');
      const res = await api.get('/attendance', {
        params: { courseId: values.courseId, subjectId: values.subjectId, date: dateStr },
      });
      const existingData = res.data.data;
      if (existingData?.records) {
        const dict = {};
        existingData.records.forEach(r => {
          const id = typeof r.studentId === 'object' ? r.studentId._id : r.studentId;
          dict[id] = r.status === 'Present';
        });
        setAttendanceRecords(dict);
        message.success('Loaded existing attendance for this date.');
      } else {
        const dict = {};
        students.forEach(s => { dict[s._id] = true; });
        setAttendanceRecords(dict);
        message.info('No records found. All marked Present by default.');
      }
    } catch {
      message.error('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAttendance = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const dateStr = values.date.format('YYYY-MM-DD');
      const recordsToSave = students.map(s => ({
        studentId: s._id,
        status: attendanceRecords[s._id] ? 'Present' : 'Absent',
      }));
      await api.post('/attendance', {
        courseId:  values.courseId,
        subjectId: values.subjectId,
        date:      dateStr,
        records:   recordsToSave,
      });
      message.success('Attendance saved successfully!');
    } catch (err) {
      if (err?.response?.data?.message) {
        message.error(err.response.data.message); // Show ownership error
      } else {
        message.error('Failed to save attendance');
      }
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { title: 'Student Name', dataIndex: 'name', key: 'name' },
    { title: 'Department',   dataIndex: 'department', key: 'department' },
    {
      title: 'Status',
      key: 'status',
      width: 160,
      render: (_, record) => {
        const isPresent = attendanceRecords[record._id] ?? true;
        return (
          <Switch
            checkedChildren="Present"
            unCheckedChildren="Absent"
            checked={isPresent}
            onChange={(v) => setAttendanceRecords(p => ({ ...p, [record._id]: v }))}
          />
        );
      },
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Class Attendance</h1>
      <p className="text-gray-500 mb-6">Select a class session to load the roster and mark attendance.</p>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
        <Form form={form} layout="vertical" className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <Form.Item name="date" label="Date" rules={[{ required: true }]} initialValue={dayjs()}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="courseId" label="Course" rules={[{ required: true }]}>
            <Select placeholder="Select Course" showSearch optionFilterProp="children">
              {courses.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="subjectId" label="Subject" rules={[{ required: true }]}>
            <Select placeholder="Select Subject" showSearch optionFilterProp="children">
              {subjects.map(s => <Option key={s._id} value={s._id}>{s.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleFetchAttendance} loading={loading} className="w-full">
              Load Roster
            </Button>
          </Form.Item>
        </Form>
      </div>

      {Object.keys(attendanceRecords).length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Roster</h3>
            <Button type="primary" onClick={handleSaveAttendance} loading={saving}>
              Save Attendance
            </Button>
          </div>
          <Table
            dataSource={students}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 50 }}
            size="middle"
          />
        </div>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function Attendance() {
  const { user } = useAuth();

  if (user?.role === 'student') return <StudentAttendanceView />;
  return <TeacherAttendanceView />;
}
