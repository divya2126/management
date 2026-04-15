const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");             // ✅ HTTP security headers
const rateLimit = require("express-rate-limit"); // ✅ Brute-force protection
const jwt = require("jsonwebtoken");

const apiRoutes = require("./routes/api");

const app = express();

// ─── Security Headers ─────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));

// ─── Body Parser (with size limit to prevent DoS) ────────────────────────────
app.use(express.json({ limit: "10kb" }));       // ✅ Prevent 500MB JSON bombs
app.use(cookieParser());

// ─── Global Rate Limiter ──────────────────────────────────────────────────────
// Strict limit on login/register (100 attempts per 15 minutes per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again in 15 minutes." },
});

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please slow down." },
});

app.use("/api/auth/login", authLimiter);      // ✅ Strict on login
app.use("/api/auth/register", authLimiter);   // ✅ Strict on register
app.use("/api", apiLimiter);                  // ✅ General limit on all API

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.send("Backend running 🚀"));
app.use("/api", apiRoutes);

// ─── MongoDB ──────────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI, { family: 4 })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

// ─── HTTP + Socket.IO ─────────────────────────────────────────────────────────
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Socket.IO Authentication Middleware
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Invalid or expired token"));
  }
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log(`🟢 User connected: ${socket.user?.role} (${socket.id})`);
  // Join a room based on role so broadcasts can be targeted
  if (socket.user?.role) {
    socket.join(socket.user.role);
  }
  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});