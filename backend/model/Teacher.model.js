const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePhoto: { type: String },
  status: { type: String, enum: ["Active", "On Leave"], default: "Active" }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);