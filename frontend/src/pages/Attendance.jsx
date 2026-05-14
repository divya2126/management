import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Form, Input, Button, Table, message, Spin, Progress, Alert, Modal, Card, Typography, Row, Col, QRCode, Checkbox } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, BookOutlined, ClockCircleOutlined, EnvironmentOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Text } = Typography;

// ─── Student View: Code input and real attendance data ──────────────────────────────
function StudentAttendanceView() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeForm] = Form.useForm();

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await api.get('/attendance/my');
      setData(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load your attendance records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleVerifyCode = async (values) => {
    try {
      setCodeLoading(true);
      await api.post('/attendance/session/verify', { token: values.code });
      message.success("Attendance marked successfully! ✅");
      codeForm.resetFields();
      fetchSummary();
    } catch (err) {
      message.error(err?.response?.data?.message || "Invalid or expired code.");
    } finally {
      setCodeLoading(false);
    }
  };

  if (loading && !data) return <div className="flex justify-center py-20"><Spin size="large" tip="Loading your attendance..." /></div>;

  if (error) return (
    <div className="p-6">
      <Alert message="Attendance Unavailable" description={error} type="warning" showIcon />
    </div>
  );

  const { overallPercentage, totalClasses, present, absent, perSubject, studentName } = data || {};

  const statusColor = overallPercentage === null ? '#6b7280'
    : overallPercentage >= 75 ? '#16a34a'
    : overallPercentage >= 60 ? '#d97706'
    : '#dc2626';

  const columns = [
    { title: 'Subject', dataIndex: 'subject', key: 'subject', className: 'font-medium' },
    { title: 'Attended', key: 'attended', render: (_, r) => `${r.present} / ${r.total}` },
    {
      title: 'Percentage',
      key: 'percentage',
      render: (_, r) => (
        <Progress percent={r.percentage} size="small" strokeColor={r.percentage >= 75 ? '#16a34a' : r.percentage >= 60 ? '#d97706' : '#dc2626'} />
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, r) => r.percentage >= 75
          ? <span className="text-green-600 font-semibold flex items-center gap-1"><CheckCircleOutlined /> Good</span>
          : <span className="text-red-500 font-semibold flex items-center gap-1"><CloseCircleOutlined /> Low</span>,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <BookOutlined className="text-indigo-600" /> My Attendance
      </h1>

      {/* Code Entry Card */}
      <Card className="mb-6 rounded-2xl shadow-sm border border-indigo-100" style={{ background: '#f8fafc' }}>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-800">Mark Attendance</h2>
            <p className="text-gray-500 text-sm">Are you in class right now? Enter the 6-digit code shown on the professor's screen.</p>
          </div>
          <div className="flex-1 w-full max-w-sm">
            <Form form={codeForm} layout="inline" onFinish={handleVerifyCode} className="flex gap-2">
              <Form.Item name="code" rules={[{ required: true, message: "Required" }]} className="flex-1 mb-0">
                <Input placeholder="Enter 6-digit code..." size="large" className="text-center tracking-widest uppercase font-mono" maxLength={6} />
              </Form.Item>
              <Form.Item className="mb-0">
                <Button type="primary" htmlType="submit" size="large" loading={codeLoading} style={{ background: '#4f46e5' }}>
                  Verify
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Card>

      {/* Overall card */}
      {data && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-32 h-32 rounded-full border-4 flex items-center justify-center flex-shrink-0" style={{ borderColor: statusColor }}>
            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: statusColor }}>
                {overallPercentage !== null ? `${overallPercentage}%` : '—'}
              </p>
              <p className="text-xs text-gray-400">Overall</p>
            </div>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">{studentName}</p>
            <div className="flex gap-6 mt-3 text-sm text-gray-600">
              <span>📅 Total: <b>{totalClasses}</b></span>
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
      )}

      {/* Per-subject table */}
      {perSubject?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50"><h2 className="font-bold text-gray-800">Subject-wise Breakdown</h2></div>
          <Table dataSource={perSubject} columns={columns} rowKey="subject" pagination={false} size="middle" />
        </div>
      )}
    </div>
  );
}

// ─── Teacher / Admin / HOD View ───────────────────────────────────────────────
function TeacherAttendanceView() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Session State
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [activeSession, setActiveSession] = useState(null); // { token, expiresAt, total, present }
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [activeSubjectId, setActiveSubjectId] = useState(null);
  const [activeRoster, setActiveRoster] = useState([]);
  const [isInitializing, setIsInitializing] = useState(false);

  const pollIntervalRef = useRef(null);

  useEffect(() => {
    fetchTodayClasses();
    return () => stopPolling();
  }, []);

  const fetchTodayClasses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/attendance/today');
      setSchedules(res.data.data);
    } catch {
      message.error("Failed to load today's scheduled classes.");
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (cId, sId) => {
    stopPolling();
    pollIntervalRef.current = setInterval(async () => {
       try {
         const res = await api.get('/attendance/session/active', { params: { courseId: cId, subjectId: sId }});
         if (res.data.success && res.data.data) {
             setActiveRoster(res.data.data.records);
         }
       } catch (err) {}
    }, 3000); // Poll every 3s
  };

  const stopPolling = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
  };

  const handleStartSession = async (courseId, subjectId) => {
    try {
      setIsInitializing(true);
      setSessionModalOpen(true);
      setActiveCourseId(courseId);
      setActiveSubjectId(subjectId);
      
      const res = await api.post('/attendance/session/start', { courseId, subjectId });
      setActiveSession({ token: res.data.token, expiresAt: res.data.expiresAt });
      
      // Force immediate fetch of roster to show initial state
      const initialRosterRes = await api.get('/attendance/session/active', { params: { courseId, subjectId }});
      if (initialRosterRes.data.data) setActiveRoster(initialRosterRes.data.data.records);

      startPolling(courseId, subjectId);
    } catch (err) {
      setSessionModalOpen(false);
      message.error("Failed to start session.");
    } finally {
      setIsInitializing(false);
    }
  };

  // Allow manual toggling in the modal
  const handleManualToggle = async (studentId, status) => {
     try {
       // Optimistic UI update
       const nextRoster = activeRoster.map(r => r.studentId._id === studentId ? { ...r, status: status ? 'Present' : 'Absent' } : r);
       setActiveRoster(nextRoster);

       // We technically need to send it to the manual mark API.
       // Since the new logic is session based, we can just save it via the old POST endpoint
       const recordsToSave = nextRoster.map(r => ({ studentId: r.studentId._id, status: r.status }));
       await api.post('/attendance', {
          courseId: activeCourseId,
          subjectId: activeSubjectId,
          date: new Date().toISOString(),
          records: recordsToSave
       });
     } catch (err) {
        message.error("Failed to manual toggle.");
     }
  };

  const closeSession = () => {
     setSessionModalOpen(false);
     stopPolling();
     setActiveSession(null);
     setActiveRoster([]);
  };

  const rosterColumns = [
    { title: 'Student', render: (_, r) => <div><p className="font-semibold">{r.studentId.name}</p><p className="text-xs text-gray-500">{r.studentId.email}</p></div> },
    { title: 'Status', render: (_, r) => (
       <Checkbox 
         checked={r.status === 'Present'} 
         onChange={(e) => handleManualToggle(r.studentId._id, e.target.checked)}
       >
         {r.status === 'Present' ? <span className="text-green-600 font-bold">Present</span> : <span className="text-gray-400">Absent</span>}
       </Checkbox>
    )}
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Today's Lectures</h1>
      <p className="text-gray-500 mb-6">Select a class to generate the Attendance Code securely.</p>

      {loading ? (
        <div className="flex justify-center p-12"><Spin size="large" /></div>
      ) : schedules.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
           <Alert message="No classes scheduled for today!" description="Take a break or check your timetable." type="info" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {schedules.map((item) => (
            <Col xs={24} md={12} lg={8} key={item._id}>
               <Card className="shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                       <h3 className="font-bold text-lg text-indigo-700">{item.subjectId?.name}</h3>
                       <p className="text-sm text-gray-500">{item.courseId?.name}</p>
                     </div>
                     <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                       Slot {item.slot}
                     </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    <p className="text-gray-600 text-sm"><ClockCircleOutlined /> {item.startTime} - {item.endTime}</p>
                    <p className="text-gray-600 text-sm"><EnvironmentOutlined /> Room {item.roomId?.roomNumber}</p>
                  </div>
                  <Button type="primary" className="w-full h-10" style={{ background: '#4f46e5' }} onClick={() => handleStartSession(item.courseId._id, item.subjectId._id)}>
                    Start Verification Session
                  </Button>
               </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Session Modal */}
      <Modal
        title={null}
        open={sessionModalOpen}
        onCancel={closeSession}
        footer={null}
        width={800}
        destroyOnClose
        className="attendance-modal"
      >
         <div className="flex flex-col md:flex-row gap-8 mt-4">
           {/* Left side: Code and QR */}
           <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-6 border border-gray-100">
              {isInitializing ? <Spin /> : (
                <>
                  <Title level={4} className="!mb-6 text-gray-500">Scan to Verify Presence</Title>
                  <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
                    {/* Generates QR from ant design directly containing the token text (or URL) */}
                    <QRCode value={activeSession?.token || 'loading'} size={220} color="#4f46e5" />
                  </div>
                  <Text className="text-gray-400 mb-2">OR ENTER CODE</Text>
                  <div className="text-5xl tracking-widest font-mono font-black text-indigo-700">
                    {activeSession?.token}
                  </div>
                  {activeSession?.expiresAt && (
                    <Text className="text-xs text-red-400 mt-4 font-semibold">
                      Expires at {new Date(activeSession.expiresAt).toLocaleTimeString()}
                    </Text>
                  )}
                </>
              )}
           </div>

           {/* Right side: Live roster */}
           <div className="flex-1 max-h-[500px] overflow-y-auto">
             <div className="sticky top-0 bg-white pb-4 mb-2 border-b flex justify-between items-center z-10">
               <Title level={4} className="!mb-0"><TeamOutlined /> Live Roster</Title>
               <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-200">
                  {activeRoster.filter(r => r.status === 'Present').length} / {activeRoster.length}
               </div>
             </div>
             
             <Table 
               dataSource={activeRoster} 
               columns={rosterColumns} 
               rowKey={r => r.studentId._id}
               pagination={false}
               size="small"
               showHeader={false}
             />
           </div>
         </div>
      </Modal>

    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function Attendance() {
  const { user } = useAuth();
  if (user?.role === 'student') return <StudentAttendanceView />;
  return <TeacherAttendanceView />;
}
