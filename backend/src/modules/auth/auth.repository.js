const User = require("../../models/User");

/* =========================================
   SHARED SELECTOR
========================================= */

const USER_SAFE_SELECT = "-password";

/* =========================================
   CREATE USER
========================================= */

const createUser = async (payload) => {
  return User.create(payload);
};

/* =========================================
   FIND USER BY ID
========================================= */

const findUserById = async (userId) => {
  return User.findById(userId)
    .select(USER_SAFE_SELECT)
    .lean();
};

/* =========================================
   FIND USER BY ID WITH PASSWORD
========================================= */

const findUserByIdWithPassword = async (userId) => {
  return User.findById(userId).select("+password");
};

/* =========================================
   FIND USER BY EMAIL
========================================= */

const findUserByEmail = async (email) => {
  return User.findOne({
    email: email.toLowerCase().trim(),
  })
    .select(USER_SAFE_SELECT)
    .lean();
};

/* =========================================
   FIND USER BY EMAIL WITH PASSWORD
========================================= */

const findUserByEmailWithPassword = async (email) => {
  return User.findOne({
    email: email.toLowerCase().trim(),
  }).select("+password");
};

/* =========================================
   FIND USER BY PHONE
========================================= */

const findUserByPhone = async ({ countryCode, phoneNumber }) => {
  return User.findOne({
    countryCode,
    phoneNumber,
  })
    .select(USER_SAFE_SELECT)
    .lean();
};

/* =========================================
   UPDATE USER BY ID
========================================= */

const updateUserById = async (userId, updatePayload) => {
  return User.findByIdAndUpdate(userId, updatePayload, {
    new: true,
    runValidators: true,
  })
    .select(USER_SAFE_SELECT)
    .lean();
};

/* =========================================
   UPDATE USER PASSWORD
========================================= */

const updateUserPassword = async (userId, hashedPassword) => {
  return User.findByIdAndUpdate(
    userId,
    {
      password: hashedPassword,
      passwordChangedAt: new Date(),
    },
    { new: true }
  );
};

/* =========================================
   VERIFY USER EMAIL
========================================= */

const verifyUserEmail = async (userId) => {
  return User.findByIdAndUpdate(
    userId,
    { emailVerified: true },
    { new: true }
  )
    .select(USER_SAFE_SELECT)
    .lean();
};

/* =========================================
   UPDATE USER ROLE
========================================= */

const updateUserRole = async (userId, role) => {
  return User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  )
    .select(USER_SAFE_SELECT)
    .lean();
};

/* =========================================
   UPDATE LAST LOGIN
========================================= */

const updateLastLogin = async (userId) => {
  return User.findByIdAndUpdate(
    userId,
    { lastLogin: new Date() },
    { new: true }
  )
    .select(USER_SAFE_SELECT)
    .lean();
};

/* =========================================
   UPDATE USER STATUS
========================================= */

const updateUserStatus = async (userId, status) => {
  return User.findByIdAndUpdate(
    userId,
    { status },
    { new: true }
  )
    .select(USER_SAFE_SELECT)
    .lean();
};

/* =========================================
   DELETE USER
========================================= */

const deleteUser = async (userId) => {
  return User.findByIdAndDelete(userId);
};

/* =========================================
   CHECK USER EXISTS BY EMAIL
========================================= */

const userExistsByEmail = async (email) => {
  return Boolean(
    await User.exists({
      email: email.toLowerCase().trim(),
    })
  );
};

/* =========================================
   CHECK USER EXISTS BY PHONE
========================================= */

const userExistsByPhone = async ({ countryCode, phoneNumber }) => {
  return Boolean(
    await User.exists({
      countryCode,
      phoneNumber,
    })
  );
};

/* =========================================
   GET PENDING USERS
========================================= */

const getPendingUsers = async () => {
  return User.find({
    emailVerified: false,
    status: "pending",
  })
    .select(USER_SAFE_SELECT)
    .lean();
};

/* =========================================
   DELETE UNVERIFIED USERS
========================================= */

const deleteUnverifiedUsers = async (date) => {
  return User.deleteMany({
    emailVerified: false,
    createdAt: { $lt: date },
  });
};

/* =========================================
   EXPORTS
========================================= */

module.exports = {
  createUser,
  findUserById,
  findUserByIdWithPassword,
  findUserByEmail,
  findUserByEmailWithPassword,
  findUserByPhone,
  updateUserById,
  updateUserPassword,
  verifyUserEmail,
  updateUserRole,
  updateLastLogin,
  updateUserStatus,
  deleteUser,
  userExistsByEmail,
  userExistsByPhone,
  getPendingUsers,
  deleteUnverifiedUsers,
};