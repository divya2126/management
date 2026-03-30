const RegisterModel = require("../model/Register.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerService = async (data) => {

  const { name, password } = data;
  const email = data.email?.toLowerCase();

  // check if user exists
  const existingUser = await RegisterModel.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  const user = await RegisterModel.create({
    name,
    email,
    password: hashedPassword,
    role: "student", // FORCE student role for public registration
  });

  // generate token
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    user,
    token,
  };
};

    const loginService = async (data) => {

  const { password } = data;
  const email = data.email?.toLowerCase();

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await RegisterModel.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("User not found");
  }

  // 🔥 Prevent Google users from normal login
  if (user.provider === "google") {
    throw new Error("Please login with Google");
  }

  if (!password) {
    throw new Error("Password is required");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    user,
    token,
  };
};

module.exports = {
  registerService,
  loginService,
};