const Timetable = require("../model/Timetable.model");

// Create Timetable Entry
exports.createTimetable = async (req, res) => {
  try {
    const { departmentId, courseId, subjectId, teacherId, roomId, dayOfWeek, startTime, endTime } = req.body;
    
    // Create new entry
    const newEntry = new Timetable({
      departmentId, courseId, subjectId, teacherId, roomId, dayOfWeek, startTime, endTime
    });

    await newEntry.save();
    res.status(201).json({ success: true, entry: newEntry });
  } catch (error) {
    console.error("Create timetable error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get Timetable (filtered by role)
exports.getTimetable = async (req, res) => {
  try {
    let query = {};
    
    // If it's a teacher, only show their timetable
    if (req.user.role === "teacher") {
      query.teacherId = req.user.id;
    }
    // For students, handle courseId filtering if they are linked to a course
    // (Assume standard output for now for students & admins)
    
    const timetable = await Timetable.find(query)
      .populate("departmentId", "name")
      .populate("courseId", "name")
      .populate("subjectId", "name")
      .populate("teacherId", "name")
      .populate("roomId", "name");
      
    res.status(200).json({ success: true, timetable });
  } catch (error) {
    console.error("Get timetable error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
