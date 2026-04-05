require("dotenv").config();

console.log("Starting server");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const businessRoutes = require("./routes/businessRoutes"); // ✅ ADD HERE

console.log("Routes loaded", typeof businessRoutes);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected ✅"))
//   .catch(err => console.log(err));

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// ✅ ADD HERE
console.log("About to use routes");
app.use("/api/business", businessRoutes);

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});