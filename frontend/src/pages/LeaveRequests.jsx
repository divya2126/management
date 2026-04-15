import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Form, DatePicker, Input, Button, Table, Tag, message, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import api from '../services/api';

const { RangePicker } = DatePicker;

export default function LeaveRequests() {
  const { user } = useAuth();
  const [form] = Form.useForm();
  
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/leave');
      setLeaves(data.data);
    } catch (err) {
      message.error("Failed to fetch leave requests");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestLeave = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      
      const payload = {
        startDate: values.dates[0].toISOString(),
        endDate: values.dates[1].toISOString(),
        reason: values.reason
      };

      await api.post('/leave', payload);
      message.success("Leave requested successfully");
      form.resetFields();
      fetchLeaves();
    } catch (err) {
      message.error("Failed to submit leave request");
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/leave/${id}`, { status });
      message.success(`Leave ${status}`);
      fetchLeaves();
    } catch (err) {
      message.error("Failed to update status");
    }
  };

  const columns = [
    { 
      title: "Applicant", 
      dataIndex: "teacherId", 
      key: "teacherId",
      render: (t) => t?.name || "Unknown",
      // Hide this column for regular teachers since they only see their own
      hidden: user?.role === "teacher"
    },
    { 
      title: "Start Date", 
      dataIndex: "startDate", 
      key: "startDate",
      render: (d) => dayjs(d).format("MMM DD, YYYY")
    },
    { 
      title: "End Date", 
      dataIndex: "endDate", 
      key: "endDate",
      render: (d) => dayjs(d).format("MMM DD, YYYY")
    },
    { 
      title: "Reason", 
      dataIndex: "reason", 
      key: "reason" 
    },
    { 
      title: "Status", 
      dataIndex: "status", 
      key: "status",
      render: (status) => {
        let color = "orange";
        if (status === "Approved") color = "green";
        if (status === "Rejected") color = "red";
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: "Action",
      key: "action",
      hidden: user?.role === "teacher",
      render: (_, record) => record.status === "Pending" ? (
        <div className="flex gap-2">
          <Popconfirm title="Approve leave?" onConfirm={() => updateStatus(record._id, "Approved")}>
            <Button size="small" type="primary" className="bg-green-600 hover:bg-green-500">Approve</Button>
          </Popconfirm>
          <Popconfirm title="Reject leave?" onConfirm={() => updateStatus(record._id, "Rejected")}>
             <Button size="small" danger>Reject</Button>
          </Popconfirm>
        </div>
      ) : "-"
    }
  ].filter(col => !col.hidden);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leave Requests</h1>
      
      {(user?.role === "teacher" || user?.role === "hod") && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Apply for Leave</h2>
          <Form form={form} layout="vertical" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <Form.Item name="dates" label="Leave Duration" rules={[{ required: true }]}>
              <RangePicker className="w-full" />
            </Form.Item>
            
            <Form.Item name="reason" label="Reason" rules={[{ required: true }]}>
              <Input placeholder="E.g., Medical Emergency, Personal Time..." />
            </Form.Item>

            <Form.Item className="md:col-span-2">
              <Button type="primary" onClick={handleRequestLeave} loading={submitting}>
                Submit Request
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Leave History</h2>
        <Table 
          columns={columns} 
          dataSource={leaves} 
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>
      
    </div>
  );
}
