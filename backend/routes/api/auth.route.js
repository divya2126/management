const router = require("express").Router();

const userLogin = require("../../controllers/userLogin");
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");
const userProfile = require("../../controllers/userProfile");
const googleLogin = require("../../controllers/googleLogin");
const teacherOnboard = require("../../controllers/teacherOnboard");
const changePassword = require("../../controllers/changePassword");
const forgotPassword = require("../../controllers/forgotPassword.controller");
const resetPassword = require("../../controllers/resetPassword.controller");

// Public register is REMOVED — accounts are created by admin only

// login
router.post("/login", userLogin);

// Forgot & Reset Password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Google Login
router.post("/google", googleLogin);

// Any logged-in user
router.get("/profile", authMiddleware, userProfile);

// Change password (requires auth — user must be logged in)
router.post("/change-password", authMiddleware, changePassword);

// Admin only
router.post(
  "/onboard-teacher",
  authMiddleware,
  roleMiddleware("admin"),
  teacherOnboard
);
router.get(
  "/admin-data",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.json({ message: "Admin data only" });
  }
);

module.exports = router;