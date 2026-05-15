const Business = require("../../models/Business");
const User = require("../../models/User");


/* 📌 Helper: Always populate owner */
const populateOwner = (query) =>
  query.populate("owner", "name email avatar");


/* =========================
   🏢 BUSINESS LISTING QUERIES
========================= */

/* 📌 Approved Businesses (PAGINATED + CATEGORY FILTER) */
const findApprovedBusinesses = (skip = 0, limit = 10, category = null) => {
  const filter = { status: "approved" };

  if (category && typeof category === "string" && category.trim()) {
    filter.category = category.trim();
  }

  return populateOwner(
    Business.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
  ).lean();
};


/* 📌 Count Approved Businesses */
const countApprovedBusinesses = (category = null) => {
  const filter = { status: "approved" };

  if (category && typeof category === "string" && category.trim()) {
    filter.category = category.trim();
  }

  return Business.countDocuments(filter);
};


/* 📌 Pending Businesses */
const findPendingBusinesses = () => {
  return populateOwner(
    Business.find({ status: "pending" })
      .sort({ createdAt: -1 })
  ).lean();
};


/* 📌 Rejected Businesses (🔴 FIX ADDED) */
const findRejectedBusinesses = () => {
  return populateOwner(
    Business.find({ status: "rejected" })
      .sort({ createdAt: -1 })
  ).lean();
};


/* 📌 Find Business by ID */
const findBusinessById = (id) => {
  return populateOwner(
    Business.findById(id)
  );
};


/* 📌 Count Active Businesses (owner dashboard) */
const countActiveBusinessesByOwner = (userId) => {
  return Business.countDocuments({
    owner: userId,
    status: { $in: ["pending", "approved"] },
  });
};


/* =========================
   🏢 CRUD OPERATIONS
========================= */

/* 📌 Create Business */
const createBusiness = (data) => {
  return Business.create(data);
};


/* 📌 Update Business */
const updateBusinessById = (id, updateData) => {
  return populateOwner(
    Business.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
  );
};


/* 📌 Approve Business */
const approveBusinessById = (id) => {
  return populateOwner(
    Business.findByIdAndUpdate(
      id,
      {
        status: "approved",
        rejectionReason: null,
      },
      {
        new: true,
        runValidators: true,
      }
    )
  );
};


/* 📌 Reject Business */
const rejectBusinessById = (id, reason) => {
  return populateOwner(
    Business.findByIdAndUpdate(
      id,
      {
        status: "rejected",
        rejectionReason: reason,
      },
      {
        new: true,
        runValidators: true,
      }
    )
  );
};


/* 📌 Delete Business (by document) */
const deleteBusiness = (business) => {
  return business.deleteOne();
};


/* 📌 Delete Business (by ID) */
const deleteBusinessById = (id) => {
  return Business.findByIdAndDelete(id);
};


/* =========================
   👤 USER RELATIONS
========================= */

/* 📌 Add Business to User */
const addBusinessToUser = (userId, businessId) => {
  return User.findByIdAndUpdate(userId, {
    $push: { businesses: businessId },
  });
};


/* 📌 Remove Business from User */
const removeBusinessFromUser = (userId, businessId) => {
  return User.findByIdAndUpdate(userId, {
    $pull: { businesses: businessId },
  });
};


/* =========================
   📦 EXPORTS
========================= */
module.exports = {
  findApprovedBusinesses,
  findRejectedBusinesses, // ✅ ADDED
  countApprovedBusinesses,
  findPendingBusinesses,
  findBusinessById,
  countActiveBusinessesByOwner,
  createBusiness,
  updateBusinessById,
  approveBusinessById,
  rejectBusinessById,
  deleteBusiness,
  deleteBusinessById,
  addBusinessToUser,
  removeBusinessFromUser,
};