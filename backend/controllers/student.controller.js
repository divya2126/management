const Student = require('../model/Student.model');

// Fields always hidden from API responses
const SENSITIVE_FIELDS = "-fatherName -motherName -class10Marks -class12Marks";

// ─── GET /api/students ────────────────────────────────────────────────────────
const getStudents = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 50); // ✅ Max 100 per page
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
    const existing = await Student.findOne({ email: req.body.email });
    if (existing) {
      return res.status(400).json({ message: "Student with this email already exists" });
    }

    const student = await Student.create(req.body);
    // Return without sensitive fields
    const safe = await Student.findById(student._id).select(SENSITIVE_FIELDS).lean();
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
    ).select(SENSITIVE_FIELDS); // ✅ Previously leaked sensitive fields on update

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
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStudents, createStudent, updateStudent, deleteStudent };
