const express = require("express");
const router = express.Router();

const {
  getApprovedBusinesses,
  getBusinessById,
  addBusiness,
  updateBusiness,
  deleteBusiness,
} = require("../controllers/business.controller");

const authMiddleware = require("../../middleware/auth.middleware");
const { uploadBusinessImage, optionalSingle } = require("../../middleware/upload.middleware");

/* 🌍 Public Routes */

// Get all approved businesses
router.get("/", getApprovedBusinesses);

// Get single business
router.get("/:id", getBusinessById);


/* 🔐 Protected Routes */

// Create business
router.post(
  "/",
  authMiddleware,
  optionalSingle(uploadBusinessImage, "image"),
  addBusiness
);

// Update business
router.put(
  "/:id",
  authMiddleware,
  optionalSingle(uploadBusinessImage, "image"),
  updateBusiness
);

// Delete business
router.delete(
  "/:id",
  authMiddleware,
  deleteBusiness
);

module.exports = router;