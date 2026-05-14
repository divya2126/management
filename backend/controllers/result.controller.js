const Result = require("../model/Result.model");
const Exam = require("../model/Exam.model");
const Student = require("../model/Student.model");

// Helper function to calculate grade and pass/fail status
const calculateGrade = (marksObtained, totalMarks) => {
  const percentage = (marksObtained / totalMarks) * 100;
  let grade = "F";
  let status = "Fail";

  if (percentage >= 90) grade = "A+";
  else if (percentage >= 80) grade = "A";
  else if (percentage >= 70) grade = "B+";
  else if (percentage >= 60) grade = "B";
  else if (percentage >= 50) grade = "C";
  else if (percentage >= 40) grade = "D";

  if (percentage >= 40) status = "Pass";

  return { grade, status };
};

// ─── TEACHER / ADMIN ──────────────────────────────────────────────────────────

// Upload or update results for an exam in bulk
const uploadResults = async (req, res) => {
  try {
    const { examId, results } = req.body; // results is an array of { studentId, marksObtained, remarks }

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    const totalMarks = exam.maxMarks || 100;
    const uploadedBy = req.user.id;

    const operations = results.map((resItem) => {
      const { grade, status } = calculateGrade(resItem.marksObtained, totalMarks);

      return {
        updateOne: {
          filter: { exam: examId, student: resItem.studentId },
          update: {
            $set: {
              exam: examId,
              student: resItem.studentId,
              subject: exam.subject,
              marksObtained: resItem.marksObtained,
              totalMarks,
              grade,
              status,
              remarks: resItem.remarks || "",
              uploadedBy,
            },
          },
          upsert: true,
        },
      };
    });

    if (operations.length > 0) {
      await Result.bulkWrite(operations);
    }

    res.status(200).json({ message: "Results uploaded successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch results for a specific exam (Teacher/Admin to view what they uploaded)
const getResultsByExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const results = await Result.find({ exam: examId })
      .populate("student", "name rollNumber")
      .populate("subject", "name code")
      .lean();

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── STUDENT ──────────────────────────────────────────────────────────────────

// Fetch results for the currently logged-in student
const getMyResults = async (req, res) => {
  try {
    const email = req.user.email;
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: "Student record not found" });
    }

    const results = await Result.find({ student: student._id })
      .populate({
        path: "exam",
        select: "title examType date semester",
      })
      .populate("subject", "name code credits")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadResults,
  getResultsByExam,
  getMyResults,
};
