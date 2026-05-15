const express = require("express");
const router = express.Router();

const heroController = require("../controllers/hero.controller");

const authMiddleware = require("../../middleware/auth.middleware");
const { isAdmin } = require("../../middleware/role.middleware");
const { uploadImage } = require("../../middleware/upload.middleware");

/* =========================
   🌍 PUBLIC ROUTE (HOMEPAGE)
========================= */
router.get("/", heroController.getActiveSlides);


/* =========================
   🔐 ADMIN ROUTES
========================= */
router.use(authMiddleware, isAdmin);

/*
  FIX: make frontend /api/hero/admin work
*/
router.get("/admin", heroController.getAllSlidesAdmin);

/* CREATE SLIDE */
router.post(
  "/admin",
  uploadImage.single("image"),
  heroController.createSlide
);

/* UPDATE SLIDE */
router.put(
  "/admin/:id",
  uploadImage.single("image"),
  heroController.updateSlide
);

/* DELETE SLIDE */
router.delete("/admin/:id", heroController.deleteSlide);

module.exports = router;