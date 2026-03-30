const router = require("express").Router();

const userRegister = require("../../controllers/userRegister");
const userLogin = require("../../controllers/userLogin");
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");
const userProfile = require("../../controllers/userProfile");
const googleLogin = require("../../controllers/googleLogin");
const teacherOnboard = require("../../controllers/teacherOnboard");

// register
router.post("/register", userRegister);

// login
router.post("/login", userLogin);

// Any logged in user
router.get("/profile", authMiddleware, userProfile);
 //Google Login
router.post("/google", googleLogin);

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