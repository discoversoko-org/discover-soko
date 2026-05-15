const businessRepository = require("../repositories/business.repository");
const userRepository = require("../repositories/user.repository");

const {
  validateObjectId,
  validateRejectionReason,
} = require("../validations/admin.validation");


/* =========================
   🏢 BUSINESS MODERATION
========================= */

/* 📌 PENDING BUSINESSES */
const getPendingBusinesses = () =>
  businessRepository.findPendingBusinesses();


/* 📌 APPROVED BUSINESSES */
const getApprovedBusinesses = () =>
  businessRepository.findApprovedBusinesses();


/* 📌 REJECTED BUSINESSES */
const getRejectedBusinesses = () =>
  businessRepository.findRejectedBusinesses();


/* 📌 APPROVE BUSINESS */
const approveBusiness = async (id) => {
  validateObjectId(id);

  const business = await businessRepository.approveBusinessById(id);

  if (!business) {
    throw { status: 404, message: "Business not found" };
  }

  return business;
};


/* 📌 REJECT BUSINESS */
const rejectBusiness = async (id, reason) => {
  validateObjectId(id);
  validateRejectionReason(reason);

  const business = await businessRepository.rejectBusinessById(id, reason);

  if (!business) {
    throw { status: 404, message: "Business not found" };
  }

  return business;
};


/* 📌 DELETE BUSINESS (ADMIN) */
const deleteBusinessAdmin = async (id) => {
  validateObjectId(id);

  const business = await businessRepository.deleteBusinessById(id);

  if (!business) {
    throw { status: 404, message: "Business not found" };
  }

  return business;
};


/* =========================
   👤 USER MANAGEMENT
========================= */

/* 📌 GET ALL USERS */
const getAllUsers = () =>
  userRepository.findAllUsers();


/* 📌 GET SINGLE USER */
const getUser = async (id) => {
  validateObjectId(id);

  const user = await userRepository.findUserById(id);

  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  return user;
};


/* 📌 DELETE USER */
const deleteUser = async (id) => {
  validateObjectId(id);

  const user = await userRepository.deleteUserById(id);

  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  return user;
};


/* =========================
   📦 EXPORTS
========================= */
module.exports = {
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