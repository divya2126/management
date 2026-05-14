const express = require("express");
const router = express.Router();
const dashboardCtrl = require("../../controllers/dashboard.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");

router.get(
  "/metrics",
  authMiddleware,
  dashboardCtrl.getDashboardMetrics
);

router.get(
  "/student-metrics",
  authMiddleware,
  roleMiddleware(["student"]),
  dashboardCtrl.getStudentMetrics
);

router.get(
  "/teacher-metrics",
  authMiddleware,
  roleMiddleware(["teacher", "hod", "admin"]),
  dashboardCtrl.getTeacherMetrics
);

module.exports = router;
