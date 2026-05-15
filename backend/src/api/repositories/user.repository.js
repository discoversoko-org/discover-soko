const User = require("../../models/User");

/* =========================
   FIND USER BY ID
========================= */
const findUserById = (id) => {
  return User.findById(id)
    .populate({
      path: "businesses",
      model: "Business",
    })
    .select("-password");
};

/* =========================
   FIND USER BY EMAIL
========================= */
const findUserByEmail = (email) => {
  return User.findOne({ email }).select("+password");
};

/* =========================
   GET ALL USERS
========================= */
const findAllUsers = () => {
  return User.find().select("-password");
};

/* =========================
   CREATE USER
========================= */
const createUser = (data) => {
  return User.create(data);
};

/* =========================
   UPDATE USER
   ✅ MONGOOSE v8 SAFE
========================= */
const updateUser = (userId, data) => {
  return User.findByIdAndUpdate(userId, data, {
    returnDocument: "after", // ✅ replaces new: true
    runValidators: true,
  }).select("-password");
};

/* =========================
   UPDATE USER AVATAR
========================= */
const updateUserAvatar = (userId, avatar) => {
  return User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      returnDocument: "after", // ✅ replaces new: true
      runValidators: true,
    }
  ).select("-password");
};

/* =========================
   DELETE USER
========================= */
const deleteUserById = (id) => {
  return User.findByIdAndDelete(id);
};

/* =========================
   ADD BUSINESS TO USER
========================= */
const addBusinessToUser = (userId, businessId) => {
  return User.findByIdAndUpdate(
    userId,
    { $push: { businesses: businessId } },
    {
      returnDocument: "after",
    }
  );
};

/* =========================
   REMOVE BUSINESS FROM USER
========================= */
const removeBusinessFromUser = (userId, businessId) => {
  return User.findByIdAndUpdate(
    userId,
    { $pull: { businesses: businessId } },
    {
      returnDocument: "after",
    }
  );
};

module.exports = {
  findUserById,
  findUserByEmail,
  findAllUsers,
  createUser,
  updateUser,
  updateUserAvatar,
  deleteUserById,
  addBusinessToUser,
  removeBusinessFromUser,
};