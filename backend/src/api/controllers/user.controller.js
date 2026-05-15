const asyncHandler = require("../../utils/asyncHandler");
const { sendResponse } = require("../../utils/sendResponse");
const userService = require("../services/user.service");
const { validateUpdateUser } = require("../validations/user.validation");

const User = require("../../models/User");

/* 📌 GET CURRENT USER */
exports.getMe = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user.id)
    .populate({
      path: "businesses",
      select:
        "name category location description contact image status owner createdAt updatedAt",
    })
    .select("-password");

  if (!user) {
    throw {
      status: 404,
      message: "User not found",
    };
  }

  return sendResponse(res, 200, {
    ...user.toObject(),

    businesses: Array.isArray(user.businesses)
      ? user.businesses
      : [],
  });
});

/* 📌 UPDATE PROFILE */
exports.updateProfile = asyncHandler(async (req, res) => {

  // ✅ validate only when body exists
  if (Object.keys(req.body).length > 0) {
    validateUpdateUser(req.body);
  }

  const result =
    await userService.updateProfile({
      userId: req.user.id,
      data: req.body || {},
      file: req.file || null,
    });

  return sendResponse(
    res,
    200,
    result,
    "Profile updated successfully"
  );
});