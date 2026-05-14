import { useState } from "react";
import { Button, Form, Input, Card, message, Divider } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import ReCAPTCHA from "react-google-recaptcha";
import { motion } from "framer-motion";

// Floating animated boxes config
const floatingBoxes = [
  { width: 60,  height: 60,  top: "8%",  left: "5%",  duration: 6,  delay: 0,   rotate: 45 },
  { width: 40,  height: 40,  top: "15%", left: "80%", duration: 8,  delay: 1,   rotate: 20 },
  { width: 80,  height: 80,  top: "70%", left: "10%", duration: 7,  delay: 0.5, rotate: 60 },
  { width: 30,  height: 30,  top: "55%", left: "88%", duration: 5,  delay: 2,   rotate: 30 },
  { width: 50,  height: 50,  top: "85%", left: "60%", duration: 9,  delay: 1.5, rotate: 15 },
  { width: 25,  height: 25,  top: "30%", left: "92%", duration: 6,  delay: 0.8, rotate: 75 },
  { width: 70,  height: 70,  top: "40%", left: "2%",  duration: 10, delay: 0.3, rotate: 50 },
  { width: 35,  height: 35,  top: "90%", left: "30%", duration: 7,  delay: 2.5, rotate: 40 },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [captchaToken, setCaptchaToken] = useState(null);

  const onFinish = async (values) => {
    if (!captchaToken) {
      message.error("Please complete the reCAPTCHA verification.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", values);

      // Use Context login to update state instantly
      login(res.data.token, res.data.user);

      message.success("Login successful");

      // If first login — force password change
      if (res.data.mustChangePassword) {
        navigate("/change-password");
      } else {
        navigate("/dashboard");
      }
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
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b2a3d] via-[#1e4a6a] to-[#0b2a3d] px-4 py-16 overflow-hidden">

      {/* Floating Animated Boxes */}
      {floatingBoxes.map((box, i) => (
        <motion.div
          key={i}
          className="absolute rounded-xl border border-cyan-400/20 bg-white/5 backdrop-blur-sm"
          style={{ width: box.width, height: box.height, top: box.top, left: box.left }}
          animate={{ y: [0, -20, 0], rotate: [box.rotate, box.rotate + 15, box.rotate], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: box.duration, delay: box.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#81A6C6]/10 rounded-full blur-[80px] pointer-events-none" />

      <Card className="relative z-10 w-full max-w-md shadow-2xl rounded-2xl bg-white border border-white/20">
        <div
          className="font-bold text-center mb-2 bg-gradient-to-r from-cyan-600 to-[#1e4a6a] bg-clip-text text-transparent"
          style={{ fontSize: "16px" }}
        >
          Welcome Back to Schedulify
        </div>

        <p className="text-center text-gray-500 text-sm mb-6">
          Manage your timetable smarter and faster
        </p>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter email" }]}>
            <Input size="large" className="rounded-lg focus:!border-cyan-500 hover:!border-cyan-500" />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter password" }]} className="mb-2">
            <Input.Password size="large" className="rounded-lg focus:!border-cyan-500 hover:!border-cyan-500" />
          </Form.Item>

          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm font-medium text-cyan-600 hover:text-cyan-500 transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          {/* RECAPTCHA WIDGET */}
          <div className="flex justify-center mb-6">
            <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={(val) => setCaptchaToken(val)}
            />
          </div>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="w-full rounded-lg bg-cyan-500 hover:!bg-cyan-600 border-none shadow-md"
          >
            Login
          </Button>
        </Form>

        <Divider className="text-gray-400">OR</Divider>

        <Button
          onClick={() => googleLogin()}
          size="large"
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" alt="Google Logo" />
          Continue with Google
        </Button>
      </Card>
    </div>
  );
}
