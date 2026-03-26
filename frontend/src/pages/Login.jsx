import { Button, Checkbox, Form, Input, Card, message, Divider } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

export default function Login() {
  const navigate = useNavigate();

  // ========================
  // Normal Email Login
  // ========================
  const onFinish = async (values) => {
    console.log("Recieved values:", values);
    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/login",
        values,
      );

      localStorage.setItem("token", res.data.token);

      message.success("Login successful 🚀");

      navigate("/dashboard");
    } catch (err) {
      message.error(err.response?.data?.message || "Login failed");
    }
  };

  // ========================
  // Google Login
  // ========================
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post("http://localhost:5001/api/auth/google", {
          access_token: tokenResponse.access_token,
        });

        localStorage.setItem("token", res.data.token);

        message.success("Google Login Successful 🚀");

        navigate("/dashboard");
      } catch (error) {
        message.error("Google login failed");
        console.log(error);
      }
    },

    onError: () => {
      message.error("Google Login Failed");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>

        {/* EMAIL LOGIN */}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="w-full"
          >
            Login
          </Button>
        </Form>

        <Divider>OR</Divider>

        {/* GOOGLE LOGIN */}
        <Button
          onClick={() => googleLogin()}
          size="large"
          className="w-full flex items-center justify-center gap-2"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            width="18"
          />
          Continue with Google
        </Button>
      </Card>
    </div>
  );
}
