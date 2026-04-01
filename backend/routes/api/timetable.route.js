const express = require("express");
const router = express.Router();
const timetableController = require("../../controllers/timetable.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");

// Everyone can view timetables (logic in controller filters by role)
router.get("/", authMiddleware, timetableController.getTimetable);

// Only Admin and HOD can assign Timetables
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "hod"),
  timetableController.createTimetable
);

module.exports = router;
