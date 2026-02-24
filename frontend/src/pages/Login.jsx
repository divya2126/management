import React from "react";
import { Button, Checkbox, Form, Input, Card } from "antd";

const onFinish = (values) => {
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <Card
        className="w-full max-w-md shadow-xl rounded-2xl"
        bodyStyle={{ padding: "32px" }}
      >
        {/* Heading */}
        <h1 className="text-xl font-bold text-center mb-2">
          Welcome Back 
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Login to your admin panel
        </p>

        <Form
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {/* Username */}
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please input your username!" },
            ]}
          >
            <Input size="large" placeholder="Enter username" />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
            ]}
          >
            <Input.Password size="large" placeholder="Enter password" />
          </Form.Item>

          {/* Remember */}
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          {/* Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full rounded-lg"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>

    </div>
  );
};

export default Login;