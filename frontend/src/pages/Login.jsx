import { Button, Checkbox, Form, Input, Card, message, Divider } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values) => {
    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/login",
        values,
      );

      // Use Context login to update state instantly
      login(res.data.token, res.data.user);

      message.success("Login successful ");

      navigate("/dashboard");
    } catch (err) {
      message.error(err.response?.data?.message || "Login failed");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post("http://localhost:5001/api/auth/google", {
          access_token: tokenResponse.access_token,
        });

        // Use Context login to update state instantly
        login(res.data.token, res.data.user);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#4C8CE4] to-teal-400">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl backdrop-blur-md bg-white/90 border border-white/20">
        <h1 className="text-lg font-bold text-center mb-2 bg-gradient-to-r from-[#4C8CE4] to-teal-400 bg-clip-text text-transparent text-sm">
          Welcome Back to Schedulify
        </h1>

        <p className="text-center text-gray-500 text-sm mb-6">
          Manage your timetable smarter and faster
        </p>

        {/* EMAIL LOGIN */}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input
              size="large"
              className="rounded-lg focus:!border-[#4C8CE4] hover:!border-[#4C8CE4]"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input.Password
              size="large"
              className="rounded-lg focus:!border-[#4C8CE4] hover:!border-[#4C8CE4]"
            />
          </Form.Item>

          <Form.Item>
            <Checkbox className="text-gray-600">Remember me</Checkbox>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="w-full rounded-lg bg-[#4C8CE4] hover:!bg-[#3b74c7] border-none shadow-md"
          >
            Login
          </Button>
        </Form>

        <Divider className="text-gray-400">OR</Divider>

        {/* GOOGLE LOGIN */}
        <Button
          onClick={() => googleLogin()}
          size="large"
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition mb-6"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            width="18"
            alt="Google Logo"
          />
          Continue with Google
        </Button>

        {/* GO TO REGISTER */}
        <div className="text-center mt-6">
          <span className="text-gray-500 text-sm">Don't have an account? </span>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-[#4C8CE4] font-semibold hover:text-teal-500 transition-colors duration-300 text-sm cursor-pointer"
          >
            Register Here
          </button>
        </div>
      </Card>
    </div>
  );
}
