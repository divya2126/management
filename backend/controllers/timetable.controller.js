const Timetable = require("../model/Timetable.model");
const Course    = require("../model/Course.model");
const Teacher   = require("../model/Teacher.model");
const RegisterModel = require("../model/Register.model");
const Student   = require("../model/Student.model");
const Department = require("../model/Department.model");

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Resolves the Teacher._id from a RegisterModel user.
 * Needed because JWT carries RegisterModel._id, but Timetable.teacherId
 * references Teacher._id — a completely separate collection.
 */
const resolveTeacherId = async (regUserId) => {
  const regUser = await RegisterModel.findById(regUserId).select("email").lean();
  if (!regUser) return null;
  const teacher = await Teacher.findOne({ email: regUser.email }).select("_id").lean();
  return teacher?._id || null;
};

// ─── GET /api/timetable ───────────────────────────────────────────────────────
exports.getTimetable = async (req, res) => {
  try {
    let query = {};

    // 👩‍🏫 Teacher: resolve RegisterModel._id → Teacher._id via email
    if (req.user.role === "teacher") {
      const teacherId = await resolveTeacherId(req.user.id);
      if (!teacherId) {
        // Teacher profile not found — return empty rather than all data
        return res.status(200).json({ success: true, timetable: [] });
      }
      query.teacherId = teacherId;
    }

    // 👨‍🎓 Student: look up their department as an ObjectId
    if (req.user.role === "student") {
      const regUser = await RegisterModel.findById(req.user.id).select("email").lean();
      if (regUser) {
        const studentProfile = await Student.findOne({ email: regUser.email }).select("department").lean();
        if (studentProfile?.department) {
          // Try to match by exact name
          const dept = await Department.findOne({ name: studentProfile.department }).select("_id").lean();
          // ✅ If no dept match, return empty rather than leaking all data
          query.departmentId = dept ? dept._id : null;
        } else {
          query.departmentId = null; // No profile → no data
        }
      }
    }

    const timetable = await Timetable.find(query)
      .populate("departmentId", "name")
      .populate("courseId", "name")
      .populate("subjectId", "name")
      .populate("teacherId", "name")
      .populate("roomId", "roomNumber")
      .lean();

    res.status(200).json({ success: true, timetable });
  } catch (error) {
    console.error("Get timetable error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ─── POST /api/timetable ──────────────────────────────────────────────────────
exports.createTimetable = async (req, res) => {
  try {
    const { departmentId, courseId, subjectId, teacherId, roomId, dayOfWeek, slot, startTime, endTime } = req.body;

    let finalDeptId = departmentId;
    if (!finalDeptId && courseId) {
      const course = await Course.findById(courseId).lean();
      if (course) finalDeptId = course.department;
    }

    // Check teacher conflict
    const teacherConflict = await Timetable.findOne({ teacherId, dayOfWeek, slot });
    if (teacherConflict) {
      return res.status(400).json({
        success: false,
        conflictType: "teacher",
        message: `Teacher Conflict: This professor is already teaching another class on ${dayOfWeek}, Slot ${slot}.`,
      });
    }

    // Check room conflict
    const roomConflict = await Timetable.findOne({ roomId, dayOfWeek, slot });
    if (roomConflict) {
      return res.status(400).json({
        success: false,
        conflictType: "room",
        message: `Room Conflict: This room is already occupied on ${dayOfWeek}, Slot ${slot}.`,
      });
    }

    const newEntry = new Timetable({
      departmentId: finalDeptId, courseId, subjectId, teacherId, roomId, dayOfWeek, slot, startTime, endTime,
    });

    await newEntry.save();

    const populated = await Timetable.findById(newEntry._id)
      .populate("departmentId", "name")
      .populate("courseId", "name")
      .populate("subjectId", "name")
      .populate("teacherId", "name")
      .populate("roomId", "roomNumber");

    res.status(201).json({ success: true, entry: populated });
  } catch (error) {
    if (error.code === 11000) {
      const key = Object.keys(error.keyPattern || {})[0];
      const msg = key?.includes("teacher")
        ? "Teacher Conflict: This professor is already assigned to this slot."
        : "Room Conflict: This room is already booked for this slot.";
      return res.status(400).json({ success: false, message: msg });
    }
    console.error("Create timetable error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ─── PUT /api/timetable/:id ───────────────────────────────────────────────────
exports.updateTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    const { teacherId, roomId, dayOfWeek, slot, subjectId, courseId, startTime, endTime } = req.body;

    // Check conflicts, excluding self
    const teacherConflict = await Timetable.findOne({ _id: { $ne: id }, teacherId, dayOfWeek, slot });
    if (teacherConflict) {
      return res.status(400).json({
        success: false,
        conflictType: "teacher",
        message: `Teacher Conflict: This professor is already teaching another class on ${dayOfWeek}, Slot ${slot}.`,
      });
    }

    const roomConflict = await Timetable.findOne({ _id: { $ne: id }, roomId, dayOfWeek, slot });
    if (roomConflict) {
      return res.status(400).json({
        success: false,
        conflictType: "room",
        message: `Room Conflict: This room is already occupied on ${dayOfWeek}, Slot ${slot}.`,
      });
    }

    const updated = await Timetable.findByIdAndUpdate(
      id,
      { teacherId, roomId, dayOfWeek, slot, subjectId, courseId, startTime, endTime },
      { new: true }
    )
      .populate("departmentId", "name")
      .populate("courseId", "name")
      .populate("subjectId", "name")
      .populate("teacherId", "name")
      .populate("roomId", "roomNumber");

    if (!updated) return res.status(404).json({ success: false, message: "Timetable entry not found" });

    res.status(200).json({ success: true, entry: updated });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Conflict: Duplicate slot detected." });
    }
    console.error("Update timetable error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ─── DELETE /api/timetable/:id ────────────────────────────────────────────────
exports.deleteTimetable = async (req, res) => {
  try {
    const entry = await Timetable.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ success: false, message: "Timetable entry not found" });
    res.status(200).json({ success: true, message: "Timetable entry removed" });
  } catch (error) {
    console.error("Delete timetable error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ─── GET /api/timetable/available-teachers ────────────────────────────────────
exports.getAvailableTeachers = async (req, res) => {
  try {
    const { dayOfWeek, slot } = req.query;
    if (!dayOfWeek || !slot) {
      return res.status(400).json({ success: false, message: "dayOfWeek and slot are required" });
    }

    const bookedSlots = await Timetable.find({ dayOfWeek, slot }).select("teacherId").lean();
    const bookedTeacherIds = bookedSlots.map((s) => s.teacherId.toString());

    const allTeachers = await Teacher.find({}, "name email department").lean();

    const result = allTeachers.map((t) => ({
      _id: t._id,
      name: t.name,
      email: t.email,
      department: t.department,
      available: !bookedTeacherIds.includes(t._id.toString()),
    }));

    res.status(200).json({ success: true, teachers: result });
  } catch (error) {
    console.error("Available teachers error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
