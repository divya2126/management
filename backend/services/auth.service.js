const RegisterModel = require("../model/Register.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ─── Helpers ──────────────────────────────────────────────────────────────────
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

// Strip password + provider from the user object before sending to client
const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.__v;
  return obj;
};

// ─── Register ─────────────────────────────────────────────────────────────────
const registerService = async (data) => {
  const { name, password } = data;
  const email = data.email?.toLowerCase().trim();

  // ✅ Input validation
  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required");
  }
  if (name.trim().length < 2) {
    throw new Error("Name must be at least 2 characters");
  }
  if (!isValidEmail(email)) {
    throw new Error("Invalid email address");
  }
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const existingUser = await RegisterModel.findOne({ email });
  if (existingUser) {
    throw new Error("An account with this email already exists");
  }

  const salt = await bcrypt.genSalt(12); // ✅ Increased from 10 → 12
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await RegisterModel.create({
    name: name.trim(),
    email,
    password: hashedPassword,
    role: "student", // Force student role for public registration
  });

  const token = signToken(user);

  return { user: sanitizeUser(user), token }; // ✅ Password stripped
};

// ─── Login ────────────────────────────────────────────────────────────────────
const loginService = async (data) => {
  const { password } = data;
  const email = data.email?.toLowerCase().trim();

  // ✅ Input validation
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  if (!isValidEmail(email)) {
    throw new Error("Invalid email address");
  }

  const user = await RegisterModel.findOne({ email }).select("+password");

  if (!user) {
    // ✅ Generic message — don't reveal whether the email exists or not
    throw new Error("Invalid email or password");
  }

  if (user.provider === "google") {
    throw new Error("This account uses Google login. Please sign in with Google.");
  }

  if (!user.password) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password"); // ✅ Don't say "Invalid password" (reveals email is valid)
  }

  const token = signToken(user);

  return {
    user: sanitizeUser(user),
    token,
    mustChangePassword: user.mustChangePassword || false,
  };
};

// ─── Change Password ──────────────────────────────────────────────────────────
const changePasswordService = async (userId, newPassword) => {
  if (!newPassword || newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await RegisterModel.findByIdAndUpdate(userId, {
    password: hashedPassword,
    mustChangePassword: false,
  });

  return { message: "Password changed successfully" };
};

module.exports = { registerService, loginService, changePasswordService };