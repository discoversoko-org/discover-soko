
const express = require("express");
const router = express.Router();

/* =========================
   CONTROLLERS
========================= */
const {
  getPendingBusinesses,
  getApprovedBusinesses,
  getRejectedBusinesses,
  approveBusiness,
  rejectBusiness,
  deleteBusinessAdmin,
  getAllUsers,
  getUser,
  deleteUser,
  getDashboardStats,
} = require("../controllers/admin.controller");

const heroController = require("../controllers/hero.controller");

/* =========================
   MIDDLEWARE
========================= */
const authMiddleware = require("../../middleware/auth.middleware");
const { isAdmin } = require("../../middleware/role.middleware");
const { uploadImage } = require("../../middleware/upload.middleware");

/* =========================
   🔐 GLOBAL ADMIN GUARD
========================= */
router.use(authMiddleware, isAdmin);

/* =========================
   📊 DASHBOARD STATS
========================= */
router.get("/dashboard", getDashboardStats);

/* =========================
   🏢 BUSINESS MANAGEMENT
========================= */

router.get("/business/pending", getPendingBusinesses);
router.get("/business/approved", getApprovedBusinesses);
router.get("/business/rejected", getRejectedBusinesses);

router.put("/business/:id/approve", approveBusiness);
router.put("/business/:id/reject", rejectBusiness);

router.delete("/business/:id", deleteBusinessAdmin);

/* =========================
   👤 USER MANAGEMENT
========================= */

router.get("/users", getAllUsers);
router.get("/users/:id", getUser);
router.delete("/users/:id", deleteUser);

/* =========================
   🎯 HERO SLIDES MANAGEMENT
========================= */

router.get("/slides", heroController.getAllSlidesAdmin);

router.post(
  "/slides",
  uploadImage.single("image"),
  heroController.createSlide
);

router.put(
  "/slides/:id",
  uploadImage.single("image"),
  heroController.updateSlide
);

router.delete("/slides/:id", heroController.deleteSlide);

/* =========================
   EXPORT
========================= */
module.exports = router;