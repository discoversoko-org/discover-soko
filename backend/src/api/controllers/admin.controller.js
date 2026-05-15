const asyncHandler = require("../../utils/asyncHandler");
const { sendResponse } = require("../../utils/sendResponse");

const adminService = require("../services/admin.service");

const Business = require("../../models/Business");
const User = require("../../models/User");
const HeroSlide = require("../../models/HeroSlide");

/* =========================
   📊 DASHBOARD STATS
========================= */
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalBusinesses,
    approved,
    pending,
    rejected,
    users,
    slides,
  ] = await Promise.all([
    Business.countDocuments(),
    Business.countDocuments({ status: "approved" }),
    Business.countDocuments({ status: "pending" }),
    Business.countDocuments({ status: "rejected" }),
    User.countDocuments(),
    HeroSlide.find(),
  ]);

  const activeSlides = slides.filter((s) => s.isActive).length;
  const inactiveSlides = slides.filter((s) => !s.isActive).length;

  return sendResponse(
    res,
    200,
    {
      totalBusinesses,
      approved,
      pending,
      rejected,
      users,
      activeSlides,
      inactiveSlides,
    },
    "Dashboard stats retrieved successfully"
  );
});

/* =========================
   🏢 BUSINESS MANAGEMENT
========================= */

const getPendingBusinesses = asyncHandler(async (req, res) => {
  const businesses = await adminService.getPendingBusinesses();
  return sendResponse(res, 200, businesses, "Pending businesses retrieved");
});

const getApprovedBusinesses = asyncHandler(async (req, res) => {
  const businesses = await adminService.getApprovedBusinesses();
  return sendResponse(res, 200, businesses, "Approved businesses retrieved");
});

const getRejectedBusinesses = asyncHandler(async (req, res) => {
  const businesses = await adminService.getRejectedBusinesses();
  return sendResponse(res, 200, businesses, "Rejected businesses retrieved");
});

const approveBusiness = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const business = await adminService.approveBusiness(id);
  return sendResponse(res, 200, business, "Business approved successfully");
});

const rejectBusiness = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason) {
    return sendResponse(res, 400, null, "Rejection reason is required");
  }

  const business = await adminService.rejectBusiness(id, reason);
  return sendResponse(res, 200, business, "Business rejected successfully");
});

const deleteBusinessAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await adminService.deleteBusinessAdmin(id);
  return sendResponse(res, 200, null, "Business deleted successfully");
});

/* =========================
   👤 USER MANAGEMENT
========================= */

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await adminService.getAllUsers();
  return sendResponse(res, 200, users, "Users retrieved successfully");
});

const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await adminService.getUser(id);
  return sendResponse(res, 200, user, "User retrieved successfully");
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await adminService.deleteUser(id);
  return sendResponse(res, 200, null, "User deleted successfully");
});

/* =========================
   📦 EXPORTS (🔥 IMPORTANT FIX)
========================= */
module.exports = {
  getDashboardStats,
  getPendingBusinesses,
  getApprovedBusinesses,
  getRejectedBusinesses,
  approveBusiness,
  rejectBusiness,
  deleteBusinessAdmin,
  getAllUsers,
  getUser,
  deleteUser,
};