const router = require("express").Router();
const apiRoutes = require("./api");

router.use("/api", apiRoutes);

// 404 handler
router.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

module.exports = router;