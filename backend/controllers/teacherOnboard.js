const RegisterModel = require("../model/Register.model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const teacherOnboard = async (req, res) => {
  try {
    const { name, email, department } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const lowerEmail = email.toLowerCase();
    const existingUser = await RegisterModel.findOne({ email: lowerEmail });

    if (existingUser) {
      return res.status(400).json({ message: "Teacher with this email already exists" });
    }

    // Auto-generate an 8-character password
    const generatedPassword = crypto.randomBytes(4).toString("hex");

    // Hash it before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(generatedPassword, salt);

    // Create teacher
    const teacher = await RegisterModel.create({
      name,
      email: lowerEmail,
      password: hashedPassword,
      role: "teacher",
      department: department || "General",
    });

    res.status(201).json({
      message: "Teacher onboarded successfully",
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
      },
      // WE RETURN THE GENERATED PASSWORD SO ADMIN CAN COPY IT
      temporaryPassword: generatedPassword,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = teacherOnboard;
