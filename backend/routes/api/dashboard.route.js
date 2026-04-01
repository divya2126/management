const express = require("express");
const router = express.Router();
const dashboardCtrl = require("../../controllers/dashboard.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");

router.get(
  "/metrics",
  authMiddleware,
  roleMiddleware("admin", "hod"),
  dashboardCtrl.getDashboardMetrics
);

module.exports = router;
