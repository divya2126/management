const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  fatherName: { type: String },
  motherName: { type: String },
  class10Marks: { type: String },
  class12Marks: { type: String },
  department: { type: String },
  profilePhoto: { type: String },
  status: { type: String, enum: ["Active", "On Leave"], default: "Active" }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);