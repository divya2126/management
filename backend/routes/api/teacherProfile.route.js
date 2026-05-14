const express = require("express");
const router = express.Router();
const profileController = require("../../controllers/teacherProfile.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");

// Only Admin or HOD can configure teacher profiles
router.use(authMiddleware);
router.use(roleMiddleware("admin", "hod"));

router.get("/:teacherId", profileController.getProfileByTeacherId);
router.post("/upsert", profileController.upsertProfile);

module.exports = router;
