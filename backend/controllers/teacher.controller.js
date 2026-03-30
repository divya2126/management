const Teacher = require('../model/Teacher.model');

// Get all teachers
const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new teacher
const createTeacher = async (req, res) => {
  try {
    const { name, department, email, status, profilePhoto } = req.body;
    
    // Check if teacher exists
    const existing = await Teacher.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Teacher with this email already exists" });
    }

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
    res.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTeachers, createTeacher, updateTeacher, deleteTeacher };