const express = require("express");
const router = express.Router();
const Business = require("../models/Business");

console.log("Router created");
console.log("Business model:", typeof Business);

router.use((req, res, next) => {
  console.log("Router middleware hit");
  next();
});

// ➕ Create business
router.post("/", async (req, res) => {
  try {
    // Mock response for testing without MongoDB
    const newBusiness = {
      _id: Math.random().toString(36).substr(2, 9),
      ...req.body,
      approved: false,
      createdAt: new Date()
    };
    res.json(newBusiness);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📥 Get all businesses
router.get("/", async (req, res) => {
  try {
    // Mock data for testing without MongoDB
    const mockBusinesses = [
      { _id: "1", name: "Tech Store", category: "Technology", location: "NYC", approved: true },
      { _id: "2", name: "Cafe Shop", category: "Food", location: "LA", approved: false }
    ];
    res.json(mockBusinesses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;