const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");
const resultController = require("../../controllers/result.controller");

// Upload/Update results (Teacher/HOD/Admin only)
router.post(
  "/upload",
  authMiddleware,
  roleMiddleware("teacher", "hod", "admin"),
  resultController.uploadResults
);

// Get results by exam ID (Teacher/HOD/Admin only)
router.get(
  "/exam/:examId",
  authMiddleware,
  roleMiddleware("teacher", "hod", "admin"),
  resultController.getResultsByExam
);

// Get results for the logged-in student (Student only)
router.get(
  "/my-results",
  authMiddleware,
  roleMiddleware("student"),
  resultController.getMyResults
);

module.exports = router;
