import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Form, Input, Button, Switch, Divider, Card, message, Tabs } from "antd";
import { UserOutlined, LockOutlined, BellOutlined, SafetyCertificateOutlined } from "@ant-design/icons";

export default function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("Profile updated successfully (Mock)!");
    }, 1000);
  };

  const handleUpdatePassword = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("Password changed successfully (Mock)!");
    }, 1000);
  };

  const profileContent = (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h2>
      <Form layout="vertical" onFinish={handleUpdateProfile} initialValues={{ name: user?.name, email: user?.email, role: user?.role }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item label="Full Name" name="name" rules={[{ required: true, message: "Please enter your name" }]}>
            <Input prefix={<UserOutlined className="text-gray-400" />} size="large" />
          </Form.Item>
          <Form.Item label="Email Address" name="email" rules={[{ required: true, type: "email" }]}>
            <Input size="large" disabled />
          </Form.Item>
        </div>
        <Form.Item label="Role" name="role">
          <Input size="large" disabled className="capitalize" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} className="bg-blue-600 w-full md:w-auto h-10 px-8 rounded-md font-medium">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

  const securityContent = (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Change Password</h2>
      <Form layout="vertical" onFinish={handleUpdatePassword}>
        <Form.Item label="Current Password" name="currentPassword" rules={[{ required: true, message: "Required" }]}>
          <Input.Password prefix={<LockOutlined className="text-gray-400" />} size="large" />
        </Form.Item>
        <Form.Item label="New Password" name="newPassword" rules={[{ required: true, message: "Required" }]}>
          <Input.Password prefix={<SafetyCertificateOutlined className="text-gray-400" />} size="large" />
        </Form.Item>
        <Form.Item label="Confirm New Password" name="confirmPassword" rules={[
          { required: true, message: "Please confirm your password" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
          }),
        ]}>
          <Input.Password prefix={<LockOutlined className="text-gray-400" />} size="large" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} className="bg-blue-600 w-full md:w-auto h-10 px-8 rounded-md font-medium">
            Update Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

  const notificationsContent = (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Notification Preferences</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-medium text-gray-800">Email Notifications</h4>
            <p className="text-sm text-gray-500">Receive system updates and alerts via email.</p>
          </div>
          <Switch defaultChecked />
        </div>
        <Divider className="my-2" />
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-medium text-gray-800">Push Notifications</h4>
            <p className="text-sm text-gray-500">Enable browser push notifications for urgent alerts.</p>
          </div>
          <Switch defaultChecked />
        </div>
        <Divider className="my-2" />
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-medium text-gray-800">Marketing & Newsletter</h4>
            <p className="text-sm text-gray-500">Receive monthly newsletters and updates.</p>
          </div>
          <Switch />
        </div>
      </div>
    </div>
  );

  const tabItems = [
    {
      key: '1',
      label: <span className="flex items-center gap-2"><UserOutlined /> Profile</span>,
      children: profileContent,
    },
    {
      key: '2',
      label: <span className="flex items-center gap-2"><LockOutlined /> Security</span>,
      children: securityContent,
    },
    {
      key: '3',
      label: <span className="flex items-center gap-2"><BellOutlined /> Notifications</span>,
      children: notificationsContent,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
        <p className="text-gray-500">Manage your profile, security, and preferences.</p>
      </div>

      <Card className="shadow-sm rounded-xl overflow-hidden border-none p-2">
        <Tabs defaultActiveKey="1" items={tabItems} className="custom-tabs" />
      </Card>
    </div>
  );
}
