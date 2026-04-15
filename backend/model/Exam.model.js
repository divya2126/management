const mongoose = require("mongoose");

const ExamSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    examType: {
      type: String,
      enum: ["Mid-Term", "End-Term", "Internal", "Practical", "Quiz"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String, // e.g. "10:00 AM"
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
      default: 180,
    },
    venue: {
      type: String,
      required: true,
    },
    maxMarks: {
      type: Number,
      required: true,
      default: 100,
    },
    semester: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Ongoing", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegisterModel",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", ExamSchema);
