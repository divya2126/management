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

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Make io accessible in controllers
app.set("io", io);

io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);
  
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`🚀 System Architecture Updated. Modular roles initialized!`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});