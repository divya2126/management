const Student = require('../model/Student.model');
const RegisterModel = require('../model/Register.model');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendWelcomeEmail } = require('../services/email.service');

// Fields always hidden from API responses
const SENSITIVE_FIELDS = "-fatherName -motherName -class10Marks -class12Marks";

// Generate a secure random temporary password
const generateTempPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!';
  let password = '';
  const bytes = crypto.randomBytes(10);
  for (let i = 0; i < 10; i++) {
    password += chars[bytes[i] % chars.length];
  }
  return password;
};

// ─── GET /api/students ────────────────────────────────────────────────────────
const getStudents = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 50);
    const skip  = (page - 1) * limit;

    const [students, total] = await Promise.all([
      Student.find()
        .select(SENSITIVE_FIELDS)
        .skip(skip)
        .limit(limit)
        .lean(),
      Student.countDocuments(),
    ]);

    res.json({
      data: students,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── POST /api/students ───────────────────────────────────────────────────────
const createStudent = async (req, res) => {
  try {
    const { name, email } = req.body;

    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Student with this email already exists" });
    }

    // Check if login account already exists
    const existingUser = await RegisterModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "A login account with this email already exists" });
    }

    // Generate random temporary password
    const tempPassword = generateTempPassword();

    // Hash it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    // Auto-Provision the Login User
    await RegisterModel.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
      mustChangePassword: true, // Force password change on first login
    });

    // Create the Student record
    const student = await Student.create(req.body);
    const safe = await Student.findById(student._id).select(SENSITIVE_FIELDS).lean();

    // Send welcome email with credentials (non-blocking)
    sendWelcomeEmail(name, email, tempPassword, "student").catch((err) => {
      console.error("Failed to send welcome email:", err.message);
    });

    res.status(201).json(safe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PUT /api/students/:id ────────────────────────────────────────────────────
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select(SENSITIVE_FIELDS);

    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE /api/students/:id ─────────────────────────────────────────────────
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Also remove their login access
    await RegisterModel.findOneAndDelete({ email: student.email });

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStudents, createStudent, updateStudent, deleteStudent };
