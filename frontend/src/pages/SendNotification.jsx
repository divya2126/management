import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Form, Input, Button, Select, message, Alert } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Option } = Select;
const { TextArea } = Input;

export default function SendNotification() {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await api.post("/notifications", values);
      message.success("Notification sent successfully! It has been broadcasted via WebSockets.");
      form.resetFields();
    } catch (err) {
      message.error("Failed to send notification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Send a Notice</h1>
      
      <Alert 
        message="Broadcast Tool" 
        description="This will send a live notification to the targeted group. It will immediately appear on their dashbaords."
        type="info" 
        showIcon 
        className="mb-8"
      />

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item 
              name="targetRole" 
              label="Target Audience" 
              rules={[{ required: true }]}
              initialValue="all"
            >
              <Select>
                <Option value="all">Everyone</Option>
                <Option value="student">All Students</Option>
                <Option value="teacher">All Faculty</Option>
              </Select>
            </Form.Item>

            <Form.Item 
              name="type" 
              label="Notice Priority" 
              rules={[{ required: true }]}
              initialValue="general"
            >
              <Select>
                <Option value="general">General (Blue)</Option>
                <Option value="urgent">Urgent / Alert (Red)</Option>
                <Option value="leave">Leave Request Notice (Green)</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item 
            name="message" 
            label="Message Body" 
            rules={[{ required: true, message: "A message is required." }]}
          >
            <TextArea 
              rows={4} 
              placeholder="E.g., Dr. Smith's class tomorrow is canceled due to an emergency..."
            />
          </Form.Item>

          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            icon={<SendOutlined />}
            size="large"
          >
            Broadcast
          </Button>

        </Form>
      </div>

    </div>
  );
}
