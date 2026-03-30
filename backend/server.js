const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // ✅ NEW

const apiRoutes = require("./routes/api");

const app = express();

// CORS
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(cookieParser()); // ✅ IMPORTANT

// Test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// Routes
app.use("/api", apiRoutes);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI, { family: 4 })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ Mongo Error:", err));

// Server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});