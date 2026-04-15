const express = require("express");
const router = express.Router();
const leaveCtrl = require("../../controllers/leave.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");

// GET /api/leave (Teachers view theirs, HOD/Admin view all)
router.get("/", authMiddleware, leaveCtrl.getLeaves);

// POST /api/leave (Teachers submit leave)
router.post("/", authMiddleware, roleMiddleware("teacher", "hod", "admin"), leaveCtrl.requestLeave);

// PUT /api/leave/:id (HOD/Admin approve or deny)
router.put("/:id", authMiddleware, roleMiddleware("admin", "hod"), leaveCtrl.updateLeaveStatus);

module.exports = router;
