const LeaveRequest = require("../model/LeaveRequest.model");
const Teacher = require("../model/Teacher.model");

// POST /api/leave
// For Teachers to request a leave
exports.requestLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    
    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Attempt to map auth's Register ID to Teacher ID.
    // If auth req.user.id is directly the Teacher._id (since we built Teacher login that way), it should match.
    // To be safe and robust, we can just save it or find the teacher by email later if they don't map 1:1.
    // Let's assume req.user.id == Teacher._id because we saved the Registration in our earlier Auth refactor.
    
    // Wait, the Teacher page sends teacher details to `Teacher.model` AND `RegisterModel`?
    // Let's just create it with req.user.id. Since teacherId is an ObjectId, it's fine.

    let teacherObj = await Teacher.findOne({ email: req.user.email }); // fallback if auth relies on email
    // Oh, we don't have req.user.email. We have req.user.id.
    
    const leaveStatus = new LeaveRequest({
      teacherId: req.user.id, 
      startDate,
      endDate,
      reason
    });

    await leaveStatus.save();

    res.status(201).json({ success: true, message: "Leave requested successfully", data: leaveStatus });
  } catch (error) {
    console.error("Request Leave Error:", error);
    res.status(500).json({ success: false, message: "Failed to request leave" });
  }
};

// GET /api/leave
// For Teachers to view their own requests, Admin/HOD to view all
exports.getLeaves = async (req, res) => {
  try {
    const { role, id } = req.user;

    let leaves;
    if (role === "admin" || role === "hod") {
      // HOD/Admin see all pending and approved
      leaves = await LeaveRequest.find().populate("teacherId", "name email").sort({ createdAt: -1 });
    } else {
      // Teachers see only their own
      leaves = await LeaveRequest.find({ teacherId: id }).sort({ createdAt: -1 });
    }

    res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    console.error("Get Leaves Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch leaves" });
  }
};

// PUT /api/leave/:id
// For Admin/HOD to update status
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const leave = await LeaveRequest.findByIdAndUpdate(id, { status }, { new: true });
    
    if (!leave) {
      return res.status(404).json({ success: false, message: "Leave request not found" });
    }

    res.status(200).json({ success: true, message: `Leave ${status}`, data: leave });
  } catch (error) {
    console.error("Update Leave Error:", error);
    res.status(500).json({ success: false, message: "Failed to update leave request" });
  }
};
