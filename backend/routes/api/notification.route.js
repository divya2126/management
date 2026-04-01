const express = require("express");
const router = express.Router();
const notificationController = require("../../controllers/notification.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");

// Get all notifications (Everyone can see their own)
router.get("/", authMiddleware, notificationController.getNotifications);

// Create a notification (Only Admin, HOD, and Teacher can send)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "hod", "teacher"),
  notificationController.createNotification
);

module.exports = router;
