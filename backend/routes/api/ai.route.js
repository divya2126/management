const express = require("express");
const router = express.Router();
const aiCtrl = require("../../controllers/ai.controller");
const authMiddleware = require("../../middleware/auth.middleware");

// POST /api/ai/chat
router.post("/chat", authMiddleware, aiCtrl.chat);

module.exports = router;
