const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    records: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student", // Should technically match Student Model name if it exists, or RegisterModel if role="student"
          required: true,
        },
        status: {
          type: String,
          enum: ["Present", "Absent"],
          default: "Absent",
        },
      },
    ],
    activeToken: {
      type: String,
      default: null,
    },
    tokenExpiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// ✅ Index for the most common query: fetch attendance for a class on a date
attendanceSchema.index({ courseId: 1, subjectId: 1, date: 1 });
// Index for student self-attendance lookup
attendanceSchema.index({ "records.studentId": 1 });

module.exports = mongoose.model("Attendance", attendanceSchema);

