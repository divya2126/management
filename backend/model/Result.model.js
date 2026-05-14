const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    marksObtained: {
      type: Number,
      required: true,
      min: 0,
    },
    totalMarks: {
      type: Number,
      required: true,
      default: 100,
    },
    grade: {
      type: String,
      enum: ["A+", "A", "B+", "B", "C", "D", "F", "Absent"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pass", "Fail"],
      required: true,
    },
    remarks: {
      type: String,
      default: "",
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegisterModel", // Teacher or Admin who uploaded
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate results for the same student in the same exam
ResultSchema.index({ exam: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("Result", ResultSchema);
