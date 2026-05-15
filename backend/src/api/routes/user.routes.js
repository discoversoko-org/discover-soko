const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/auth.middleware");
const { uploadAvatar } = require("../../middleware/upload.middleware");

const {
  getMe,
  updateProfile,
} = require("../controllers/user.controller");

/* 📌 GET CURRENT USER */
router.get("/me", authMiddleware, getMe);

/* 📌 UPDATE PROFILE (name + avatar ONLY) */
router.put(
  "/profile",
  authMiddleware,
  uploadAvatar.single("avatar"), // handles optional file
  updateProfile
);

module.exports = router;