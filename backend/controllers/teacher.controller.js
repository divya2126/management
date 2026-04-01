const Teacher = require('../model/Teacher.model');
const RegisterModel = require('../model/Register.model');
const bcrypt = require('bcryptjs');

// Get all teachers
const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new teacher API
const createTeacher = async (req, res) => {
  try {
    const { name, department, email, status, profilePhoto, role } = req.body;
    
    // Check if teacher exists in Teacher Collection
    const existing = await Teacher.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Teacher with this email already exists" });
    }

    // Check if user exists in Login Collection
    const existingUser = await RegisterModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "A login account with this email already exists" });
    }

    // Hash Default Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Teacher@123", salt);

    // Auto-Provision the Login User (so they don't have to touch MongoDB)
    await RegisterModel.create({
      name,
      email,
      password: hashedPassword,
      role: role || "teacher", // Can be teacher or hod
    });

    // Save the Teacher Metadata
    const teacher = await Teacher.create({ name, department, email, status, profilePhoto });
    
    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a teacher
const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a teacher
const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    // Auto-Delete their login access as well
    await RegisterModel.findOneAndDelete({ email: teacher.email });

    res.json({ message: "Teacher and login access deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTeachers, createTeacher, updateTeacher, deleteTeacher };