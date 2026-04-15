const mongoose = require("mongoose");

const TimetableSchema = new mongoose.Schema({
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
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
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  dayOfWeek: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    required: true,
  },

  // 🔥 ADD THIS
  slot: {
    type: String,
    required: true,
  },

  startTime: String,
  endTime: String,

}, { timestamps: true });

// 🔒 DB-level enforcement: one teacher per slot, one room per slot
TimetableSchema.index({ teacherId: 1, dayOfWeek: 1, slot: 1 }, { unique: true });
TimetableSchema.index({ roomId: 1, dayOfWeek: 1, slot: 1 }, { unique: true });

module.exports = mongoose.model("Timetable", TimetableSchema);