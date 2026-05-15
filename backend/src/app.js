require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

/* =========================
   ROUTES
========================= */
const authRoutes = require("./api/routes/auth.routes");
const userRoutes = require("./api/routes/user.routes");
const businessRoutes = require("./api/routes/business.routes");
const adminRoutes = require("./api/routes/admin.routes");
const heroRoutes = require("./api/routes/hero.routes");

const { apiLimiter } = require("./middleware/ratelimit.middleware");

const app = express();

/* =========================
   DATABASE CONNECTION
========================= */
connectDB();

/* =========================
   CORE MIDDLEWARE
========================= */
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   DEBUG MIDDLEWARE (🔥 IMPORTANT)
   This tells you if requests reach backend
========================= */
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

/* =========================
   RATE LIMITER
========================= */
app.use("/api", apiLimiter);

/* =========================
   TEST ROUTES
========================= */
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

app.get("/api/users/test-direct", (req, res) => {
  res.json({ message: "DIRECT ROUTE WORKS" });
});

/* =========================
   API ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/hero", heroRoutes);

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  console.log(`[404] ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.url,
  });
});

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err.stack || err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

module.exports = app;