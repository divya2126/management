const Exam = require("../model/Exam.model");

// GET /api/exams — Get all exams (filtered by query params if needed)
exports.getExams = async (req, res) => {
  try {
    const { courseId, semester, status } = req.query;
    const filter = {};

    if (courseId) filter.course = courseId;
    if (semester) filter.semester = Number(semester);
    if (status) filter.status = status;

    const exams = await Exam.find(filter)
      .populate("course", "name code")
      .populate("subject", "name code")
      .sort({ date: 1 });

    res.status(200).json({ success: true, data: exams });
  } catch (error) {
    console.error("Get Exams Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch exams" });
  }
};

// POST /api/exams — Schedule a new exam (admin or hod only)
exports.createExam = async (req, res) => {
  try {
    const { title, course, subject, examType, date, startTime, duration, venue, maxMarks, semester } = req.body;

    if (!title || !course || !subject || !examType || !date || !startTime || !venue || !semester) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const exam = new Exam({
      title,
      course,
      subject,
      examType,
      date,
      startTime,
      duration: duration || 180,
      venue,
      maxMarks: maxMarks || 100,
      semester,
      status: "Scheduled",
      createdBy: req.user.id,
    });

    await exam.save();
    await exam.populate("course", "name code");
    await exam.populate("subject", "name code");

    res.status(201).json({ success: true, message: "Exam scheduled successfully", data: exam });
  } catch (error) {
    console.error("Create Exam Error:", error);
    res.status(500).json({ success: false, message: "Failed to schedule exam" });
  }
};

// PUT /api/exams/:id — Update exam details or status
exports.updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const exam = await Exam.findByIdAndUpdate(id, updates, { new: true })
      .populate("course", "name code")
      .populate("subject", "name code");

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    res.status(200).json({ success: true, message: "Exam updated", data: exam });
  } catch (error) {
    console.error("Update Exam Error:", error);
    res.status(500).json({ success: false, message: "Failed to update exam" });
  }
};

// DELETE /api/exams/:id — Delete an exam
exports.deleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findByIdAndDelete(id);

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    res.status(200).json({ success: true, message: "Exam deleted" });
  } catch (error) {
    console.error("Delete Exam Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete exam" });
  }
};
